# Agent streaming response cleanup

Actual MCPAgent.streamEvents() against local OpenAI-compatible SSE and Ollama NDJSON HTTP fixtures. The consumer breaks after its first text delta. Before, the server remains connected; after, both responses disconnect. No external model, API credential, or real MCP server is used.

Base source is upstream f877f789. Patched source is PR head 3408a62. The .cast file is an asciicast v2 terminal recording; .log contains the same captured output. Run reproduce.mjs with tsx, a label, the Agent source entry path and the built client entry path. Set MCP_USE_ANONYMIZED_TELEMETRY=false.
