import pytest
from fastapi.testclient import TestClient
from main import app
import os
import tempfile
import io

client = TestClient(app)


def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "database" in data


def test_knowledge_graph_endpoint():
    response = client.get("/api/knowledge-graph")
    assert response.status_code == 200
    data = response.json()
    assert "nodes" in data
    assert "edges" in data


def test_upload_document_endpoint():
    # Test uploading a file
    file_content = b"Fake document content for testing"
    test_file = io.BytesIO(file_content)

    response = client.post(
        "/api/upload", files={"file": ("test_doc.md", test_file, "text/markdown")}
    )

    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "success"
    assert data["filename"] == "test_doc.md"
    assert "ready for ingestion" in data["message"]
