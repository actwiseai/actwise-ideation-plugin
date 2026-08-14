# Install in Cursor

Install the Agent Plugin from GitHub:

```bash
npx --yes plugins@1.3.4 add actwiseai/actwise-ideation-plugin --target cursor --scope user --yes
```

Restart Cursor, open a new agent chat, and complete browser authentication when prompted.

## MCP-only alternative

Open Cursor settings, find MCP, and add a remote HTTP server:

```json
{
  "mcpServers": {
    "actwise-ideation": {
      "type": "http",
      "url": "https://actwise.ai/ideation/mcp/v1"
    }
  }
}
```

Enable the server and complete browser authentication when prompted. Start a new chat after the tools become available.

The MCP-only alternative exposes the evaluation tools, but it does not install the repository's Ideation skill instructions.
