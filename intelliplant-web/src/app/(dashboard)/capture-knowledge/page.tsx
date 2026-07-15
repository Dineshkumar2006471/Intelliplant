"use client";
import { useState } from 'react';

interface ExtractedKnowledge {
  equipment_tag?: string;
  symptom?: string;
  fix?: string;
}

export default function CaptureKnowledgePage() {
  const [expertName, setExpertName] = useState("Senior Engineer (John Doe)");
  const [transcript, setTranscript] = useState("Whenever we run C-104 past 80% load during winter, the outboard bearing temp spikes. The manual says it's normal up to 90C, but in my experience, if it hits 85C for more than an hour, the seal is going to warp.");
  const [isSaving, setIsSaving] = useState(false);
  const [savedData, setSavedData] = useState<ExtractedKnowledge | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const response = await fetch(`${API_BASE}/api/capture-knowledge`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ expert_name: expertName, knowledge_text: transcript })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setSavedData(data.extracted);
      } else {
        alert("Failed: " + data.message);
      }
    } catch {
      alert("Error saving knowledge");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex h-full w-full bg-background-primary p-8 overflow-y-auto">
      <div className="max-w-5xl mx-auto w-full flex flex-col gap-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-medium text-text-primary mb-2">Capture Tribal Knowledge</h1>
          <p className="text-text-secondary text-lg">Interview experts and convert their experience into structured, searchable data.</p>
        </div>

        <div className="flex gap-8">
          {/* Main Interview Area */}
          <div className="flex-1 flex flex-col gap-6">
            
            <div className="bg-background-secondary border border-border-subtle p-6 rounded-md shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">Expert Details</h2>
              <input 
                type="text" 
                value={expertName} 
                onChange={e => setExpertName(e.target.value)}
                className="w-full bg-background-primary border border-border-subtle rounded-sm px-3 py-2 text-sm focus:border-interactive-primary focus:outline-none" 
              />
            </div>
            
            <div className="bg-background-secondary border border-border-subtle p-6 rounded-md shadow-sm flex flex-col gap-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-2">Knowledge Transcript</h2>
              <textarea 
                value={transcript}
                onChange={e => setTranscript(e.target.value)}
                className="w-full bg-background-primary border border-border-subtle p-4 rounded-sm text-sm text-text-primary leading-relaxed h-48 focus:border-interactive-primary focus:outline-none resize-none"
              />
            </div>

          </div>

          {/* AI Extraction Sidebar */}
          <div className="w-80 flex flex-col gap-6">
            
            <div className="bg-background-secondary border border-border-subtle p-6 rounded-md shadow-sm">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-text-secondary mb-4">AI Extracted Data</h2>
              {savedData ? (
                <div className="flex flex-col gap-4">
                  <div>
                    <label className="text-xs text-text-secondary font-medium">Equipment Tag</label>
                    <div className="text-sm text-text-primary font-semibold">{savedData.equipment_tag || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary font-medium">Failure Mode</label>
                    <div className="text-sm text-text-primary">{savedData.failure_mode || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary font-medium">Symptom</label>
                    <div className="text-sm text-text-primary">{savedData.symptom || 'N/A'}</div>
                  </div>
                  <div>
                    <label className="text-xs text-text-secondary font-medium">Fix</label>
                    <div className="text-sm text-text-primary">{savedData.fix || 'N/A'}</div>
                  </div>
                  <div className="mt-2 text-xs text-support-success font-medium">✓ Saved to Database</div>
                </div>
              ) : (
                <div className="text-sm text-text-secondary italic">
                  Click save to extract structured data using AI.
                </div>
              )}
            </div>

            <button 
              onClick={handleSave}
              disabled={isSaving}
              className="w-full h-12 bg-interactive-primary text-white font-medium rounded-sm hover:bg-interactive-hover transition-colors shadow-sm mt-auto disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Extract & Save to Knowledge Base"}
            </button>

          </div>
        </div>

      </div>
    </div>
  );
}
