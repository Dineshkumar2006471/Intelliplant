"use client";
import Link from 'next/link';
import { useState, useRef } from 'react';

interface ExtractedNode {
  tag: string;
  name: string;
  type: string;
}

interface ExtractedEdge {
  source_tag: string;
  target_tag: string;
  relation: string;
}

interface PIDExtraction {
  nodes: ExtractedNode[];
  edges: ExtractedEdge[];
}

export default function PIDExplorerPage() {
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<PIDExtraction | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsExtracting(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8000/api/parse-pid', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      if (data.status === 'success') {
        setExtractedData(data.extracted);
      } else {
        alert("Extraction failed: " + (data.message || data.detail || JSON.stringify(data)));
      }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      alert("Error connecting to server: " + errorMsg);
    } finally {
      setIsExtracting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="flex h-full w-full bg-background-primary overflow-hidden">
      
      {/* Main Diagram Area (Left) */}
      <div className="flex-1 flex flex-col h-full border-r border-border-subtle relative">
        {/* Toolbar */}
        <div className="h-12 bg-background-primary border-b border-border-subtle flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4 text-sm">
            <span className="font-semibold text-text-primary">P&ID Explorer</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isExtracting}
              className="h-8 px-3 bg-interactive-primary text-white rounded-sm text-xs font-medium hover:bg-interactive-hover transition-colors ml-2 disabled:opacity-50"
            >
              {isExtracting ? 'Extracting...' : 'Upload & Run AI Extraction'}
            </button>
          </div>
        </div>
        
        {/* Diagram Canvas */}
        <div className="flex-1 bg-background-secondary relative overflow-hidden flex items-center justify-center p-8">
           <div className="w-full h-full max-w-4xl bg-white border border-border-subtle rounded-sm shadow-sm relative p-8 flex flex-col items-center justify-start overflow-auto">
              {extractedData ? (
                <div className="w-full text-sm">
                  <h3 className="font-bold mb-4 text-lg">Extracted Nodes:</h3>
                  <div className="grid grid-cols-3 gap-4 mb-8">
                    {extractedData.nodes?.map((node: ExtractedNode, idx: number) => (
                      <div key={idx} className="p-4 border border-interactive-primary rounded-sm bg-blue-50">
                        <div className="font-bold text-interactive-primary text-base">{node.tag}</div>
                        <div className="mt-1 font-medium">{node.name}</div>
                        <div className="text-xs text-text-secondary mt-1 uppercase tracking-wide">{node.type}</div>
                      </div>
                    ))}
                  </div>
                  <h3 className="font-bold mb-4 text-lg">Extracted Edges:</h3>
                  <div className="flex flex-col gap-2">
                    {extractedData.edges?.map((edge: ExtractedEdge, idx: number) => (
                      <div key={idx} className="p-3 border border-border-subtle rounded-sm bg-background-secondary flex items-center gap-4">
                        <span className="font-bold text-interactive-primary">{edge.source_tag}</span>
                        <span className="text-text-secondary text-xs uppercase tracking-widest flex-1 text-center">--({edge.relation})--&gt;</span>
                        <span className="font-bold text-interactive-primary">{edge.target_tag}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-text-secondary flex flex-col items-center justify-center h-full gap-4">
                  <span className="text-4xl">📄</span>
                  <p>Upload a P&ID image to see extracted entities using Gemini 1.5 Pro Multimodal.</p>
                </div>
              )}
           </div>
        </div>
      </div>

      {/* Analysis Panel (Right) */}
      <div className="w-80 shrink-0 bg-background-primary flex flex-col h-full overflow-y-auto">
        <div className="p-4 border-b border-border-subtle bg-background-secondary sticky top-0">
          <h2 className="font-semibold text-text-primary">Extraction Summary</h2>
        </div>
        
        <div className="p-4 flex flex-col gap-6">
          {extractedData ? (
             <div>
               <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider mb-3 flex items-center justify-between">
                 Knowledge Graph Updated
                 <Link href="/knowledge-graph" className="text-interactive-primary hover:underline lowercase text-[10px]">View Graph</Link>
               </h3>
               <div className="text-sm bg-support-success/10 border border-support-success/20 p-4 rounded-sm text-text-primary font-medium">
                 Successfully parsed <span className="font-bold text-support-success">{extractedData.nodes?.length || 0} nodes</span> and <span className="font-bold text-support-success">{extractedData.edges?.length || 0} edges</span> into the Knowledge Graph database.
               </div>
             </div>
          ) : (
            <div className="text-sm text-text-secondary">Awaiting upload...</div>
          )}
        </div>
      </div>
      
    </div>
  );
}
