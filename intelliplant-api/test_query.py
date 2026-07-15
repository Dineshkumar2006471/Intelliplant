from agent import ask_copilot

print("Querying Knowledge Graph for C-104...")
print(ask_copilot("What can you tell me about equipment C-104?"))

print("\n----------------\n")
print("Querying Document Search for Machinery Fencing...")
print(
    ask_copilot(
        "What are the regulations regarding fencing of machinery under OSH code 2020?"
    )
)
