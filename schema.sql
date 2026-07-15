-- SQL Schema for IntelliPlant Database
-- Execute this script in your Supabase SQL Editor

-- 1. Enable Vector Extension for RAG
CREATE EXTENSION IF NOT EXISTS vector;

-- 2. Documents Table (Metadata)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    url TEXT,
    type TEXT, -- 'pdf', 'image', 'manual', 'sop', 'compliance'
    status TEXT DEFAULT 'processing', -- 'processing', 'indexed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Document Chunks Table (For Semantic Search)
CREATE TABLE IF NOT EXISTS public.document_chunks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    metadata JSONB,
    embedding VECTOR(768) -- Vector length for Gemini Text Embedding model
);

-- 4. Create an Index for fast vector similarity search (Inner Product or Cosine)
CREATE INDEX IF NOT EXISTS document_chunks_embedding_idx 
ON public.document_chunks 
USING ivfflat (embedding vector_cosine_ops) 
WITH (lists = 100);

-- 5. Knowledge Graph Nodes (Entities)
CREATE TABLE IF NOT EXISTS public.knowledge_nodes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tag TEXT UNIQUE NOT NULL, -- e.g., 'C-104', 'V-20', 'OISD-118'
    name TEXT,
    type TEXT NOT NULL, -- 'equipment', 'person', 'date', 'regulation'
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. Knowledge Graph Edges (Relationships)
CREATE TABLE IF NOT EXISTS public.knowledge_edges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    source_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    target_id UUID REFERENCES public.knowledge_nodes(id) ON DELETE CASCADE,
    relation_type TEXT NOT NULL, -- e.g., 'controls_intake_to', 'downstream_of', 'references'
    properties JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT unique_edge UNIQUE(source_id, target_id, relation_type)
);

-- 7. Expert Knowledge Capture Table (Tribal Knowledge)
CREATE TABLE IF NOT EXISTS public.expert_captures (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    expert_name TEXT NOT NULL,
    equipment_tag TEXT REFERENCES public.knowledge_nodes(tag) ON DELETE SET NULL,
    knowledge_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. Compliance Gaps Table
CREATE TABLE IF NOT EXISTS public.compliance_gaps (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    regulation_clause TEXT NOT NULL, -- e.g., 'Factory Act Section 21'
    procedure_name TEXT NOT NULL,
    gap_description TEXT NOT NULL,
    remediation_suggestion TEXT NOT NULL,
    status TEXT DEFAULT 'open', -- 'open', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
