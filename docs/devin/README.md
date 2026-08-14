# Install in Devin

## Devin plugin

Devin supports the portable Agent Plugins layout used by this repository. Install the complete plugin from GitHub with Devin CLI:

```bash
devin plugins install actwiseai/actwise-ideation-plugin
```

Review and accept the installation prompt. The installed plugin provides the `actwise-ideation` skill and configures the hosted MCP service. Devin Plugins are currently in closed beta, so this command requires plugin access from Cognition.

## Direct MCP setup

The MCP-only path does not require access to the Devin Plugins beta. Add the hosted service with Devin CLI:

```bash
devin mcp add actwise-ideation https://actwise.ai/ideation/mcp/v1
devin mcp login actwise-ideation
```

The login command opens the browser-based OAuth flow. Start a new Devin session after authentication so the tools and prompts are available.

In the Devin web app, an organization administrator can instead open `Settings > Connections > MCP servers`, select **Add a custom MCP**, and enter:

```text
https://actwise.ai/ideation/mcp/v1
```

Use HTTP as the transport and OAuth as the authentication method. Save the connection, run **Test listing tools**, and complete browser authentication when prompted.

Devin Desktop and Devin Local may expose different MCP setup surfaces. Devin Local uses the Devin CLI configuration described above. Legacy Cascade uses its MCP settings interface.

Do not add tokens, OAuth client secrets, API keys, or user credentials to repository configuration.
