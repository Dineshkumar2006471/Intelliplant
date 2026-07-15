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


from unittest.mock import patch, MagicMock


@patch("main.supabase")
def test_knowledge_graph_endpoint(mock_supabase):
    # Setup mock chained call
    mock_execute = MagicMock()
    mock_execute.execute.return_value.data = []
    mock_select = MagicMock()
    mock_select.select.return_value = mock_execute
    mock_table = MagicMock()
    mock_table.table.return_value = mock_select
    mock_supabase.table = mock_table.table

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
