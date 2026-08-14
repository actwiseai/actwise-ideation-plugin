# Install in Cursor

## Cursor plugin interface

1. Open an agent chat in Cursor.
2. Enter `/plugin`.
3. Paste this repository URL into the plugin search:

   ```text
   https://github.com/actwiseai/actwise-ideation-plugin
   ```

4. Select Actwise Ideation and install it at user scope.
5. Start a new agent chat and complete browser authentication when prompted.

Cursor documents `/plugin` as its interactive plugin installation interface. Cursor CLI also supports `agent plugin marketplace add <git-url>` for non-interactive marketplace registration, but does not document a complete `cursor plugin install` command. See the [Cursor CLI changelog](https://cursor.com/docs/cli/changelog).

## Non-interactive installation

For scripts and CI, install the portable Agent Plugin from GitHub:

```bash
npx --yes plugins@1.3.4 add actwiseai/actwise-ideation-plugin --target cursor --scope user --yes
```

Restart Cursor after installation. This repository verifies the non-interactive path in its GitHub Actions installation gate.

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
