import { once } from "node:events";
import { createServer } from "node:http";
import { pathToFileURL } from "node:url";

const [label, agentEntry, clientEntry] = process.argv.slice(2);
globalThis.__MCP_USE_PACKAGE_VERSION__ = "source-proof";
const { MCPAgent } = await import(pathToFileURL(agentEntry).href);
const { MCPClient } = await import(pathToFileURL(clientEntry).href);

console.log(`${label}: real MCPAgent.streamEvents(), local HTTP fixtures, no external model`);
for (const provider of ["openai-compatible", "ollama"]) {
  let closed = false;
  let notifyClosed;
  const disconnected = new Promise((resolve) => { notifyClosed = resolve; });
  const frame = provider === "ollama"
    ? '{"model":"local-fixture","message":{"role":"assistant","content":"Hello"},"done":false}\n'
    : 'data: {"choices":[{"index":0,"delta":{"content":"Hello"},"finish_reason":null}]}\n\n';
  const server = createServer((request, response) => {
    request.resume();
    response.once("close", () => { closed = true; notifyClosed(); });
    response.writeHead(200, { "Content-Type": provider === "ollama" ? "application/x-ndjson" : "text/event-stream" });
    response.write(frame);
  });
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;
  const client = new MCPClient({ mcpServers: {} });
  const agent = new MCPAgent({
    client,
    llm: { provider, model: "local-fixture", apiKey: "local-fixture", baseUrl: provider === "ollama" ? origin : `${origin}/v1` },
    autoInitialize: true,
    memoryEnabled: false,
    exposeResourcesAsTools: false,
    exposePromptsAsTools: false,
  });
  let deadline;
  try {
    let text = "";
    for await (const event of agent.streamEvents({ prompt: "Say hello" })) {
      if (event.type === "text-delta") { text += event.delta; break; }
    }
    await Promise.race([disconnected, new Promise((resolve) => { deadline = setTimeout(resolve, 500); })]);
    console.log(JSON.stringify({ provider, received: text, consumerReturned: true, upstreamDisconnected: closed }));
  } finally {
    clearTimeout(deadline);
    await agent.close();
    await client.closeAllSessions();
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
}
