'use client';

import { useState, useEffect } from 'react';

interface KGNode {
  id: string;
  tag: string;
  type: string;
  name: string;
  properties?: Record<string, unknown>;
}

interface KGEdge {
  id: string;
  source_id: string;
  target_id: string;
  relation_type: string;
}

export default function KnowledgeGraphPage() {
  const [nodes, setNodes] = useState<KGNode[]>([]);
  const [edges, setEdges] = useState<KGEdge[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGraphData = async () => {
      try {
        const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${API_BASE}/api/knowledge-graph`);
        if (!res.ok) {
          throw new Error('Failed to fetch knowledge graph data');
        }
        const data = await res.json();
        setNodes(data.nodes || []);
        setEdges(data.edges || []);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchGraphData();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-background-primary">
        <div className="flex items-center gap-2 text-text-secondary">
          <span className="w-4 h-4 shadow-sm rounded-sm flex items-center justify-center bg-background-secondary text-xs animate-spin">↻</span>
          Loading Knowledge Graph...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center bg-background-primary p-8">
        <h2 className="text-xl font-semibold text-support-error mb-2">Error Loading Graph</h2>
        <p className="text-text-secondary">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full overflow-auto bg-background-primary">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="mb-8">
          <h2 className="text-2xl font-semibold text-text-primary mb-2">Knowledge Graph Explorer</h2>
          <p className="text-text-secondary">
            View the extracted entities and relationships across the plant&apos;s operational documents, equipment tags, and compliance regulations.
          </p>
        </header>

        <section>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-interactive-primary rounded-full shadow-sm"></span>
            Entities (Nodes)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {nodes.map((node) => (
              <div key={node.id} className="bg-background-secondary shadow-sm rounded-sm p-5 flex flex-col gap-2 transition-transform hover:-translate-y-1">
                <div className="flex justify-between items-start">
                  <span className="font-semibold text-text-primary">{node.tag}</span>
                  <span className="text-xs px-2 py-1 bg-background-tertiary text-text-secondary rounded-sm font-medium uppercase tracking-wider">
                    {node.type}
                  </span>
                </div>
                <p className="text-sm text-text-secondary">{node.name}</p>
                {node.properties && (
                  <div className="mt-2 text-xs text-text-disabled whitespace-pre-wrap">
                    {JSON.stringify(node.properties, null, 2)}
                  </div>
                )}
              </div>
            ))}
            {nodes.length === 0 && (
              <div className="col-span-full text-center py-12 text-text-disabled bg-background-secondary rounded-sm shadow-sm">
                No entities found in the graph.
              </div>
            )}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-text-primary mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-support-success rounded-full shadow-sm"></span>
            Relationships (Edges)
          </h3>
          <div className="overflow-x-auto bg-background-secondary shadow-sm rounded-sm">
            <table className="w-full text-left text-sm text-text-primary">
              <thead className="text-xs uppercase bg-background-tertiary text-text-secondary">
                <tr>
                  <th className="px-6 py-4 font-medium">Source Node ID</th>
                  <th className="px-6 py-4 font-medium">Relationship Type</th>
                  <th className="px-6 py-4 font-medium">Target Node ID</th>
                </tr>
              </thead>
              <tbody>
                {edges.map((edge) => (
                  <tr key={edge.id} className="border-b border-border-subtle last:border-0 hover:bg-background-primary transition-colors">
                    <td className="px-6 py-4 font-mono text-xs">{edge.source_id}</td>
                    <td className="px-6 py-4 font-medium text-interactive-primary">{edge.relation_type}</td>
                    <td className="px-6 py-4 font-mono text-xs">{edge.target_id}</td>
                  </tr>
                ))}
                {edges.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-6 py-12 text-center text-text-disabled">
                      No relationships found in the graph.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
