from db import supabase


def wipe_mock_data():
    print("Wiping mock data...")
    # Delete all expert captures
    supabase.table("expert_captures").delete().neq(
        "id", "00000000-0000-0000-0000-000000000000"
    ).execute()
    # Delete all knowledge edges
    supabase.table("knowledge_edges").delete().neq(
        "id", "00000000-0000-0000-0000-000000000000"
    ).execute()
    # Delete all knowledge nodes
    supabase.table("knowledge_nodes").delete().neq(
        "id", "00000000-0000-0000-0000-000000000000"
    ).execute()
    print("Mock data wiped successfully.")


if __name__ == "__main__":
    wipe_mock_data()
