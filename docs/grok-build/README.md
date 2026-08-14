# Install in Grok Build

Install directly from the public GitHub repository:

```bash
grok plugin install actwiseai/actwise-ideation-plugin --trust
```

Without `--trust`, Grok displays the plugin source and security warning, then stops before installation. `--trust` confirms installation and allows the hosted MCP configuration to run. It does not represent xAI marketplace approval.

Open `/mcps`, select `actwise-ideation`, and complete browser OAuth. Verify the installation with:

```bash
grok plugin details actwise-ideation
grok inspect --json
```

Marketplace listing is optional for direct installation. Official discovery requires a separate pull request to the xAI plugin marketplace with a pinned, full 40-character commit SHA.
