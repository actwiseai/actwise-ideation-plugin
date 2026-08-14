# Install in Cursor

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
