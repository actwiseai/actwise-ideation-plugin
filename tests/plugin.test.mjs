import assert from "node:assert/strict";
import { readFile, stat } from "node:fs/promises";
import path from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const endpoint = "https://actwise.ai/ideation/mcp/v1";
const repository = "https://github.com/actwiseai/actwise-ideation-plugin";

const jsonFiles = [
  "package.json",
  "package-lock.json",
  "plugin.json",
  "mcp.json",
  ".mcp.json",
  ".codex-plugin/plugin.json",
  ".grok-plugin/plugin.json",
  ".agents/plugins/marketplace.json",
  ".claude-plugin/plugin.json",
  ".claude-plugin/marketplace.json"
];

async function read(relativePath) {
  return readFile(path.join(root, relativePath), "utf8");
}

async function json(relativePath) {
  return JSON.parse(await read(relativePath));
}

async function exists(relativePath) {
  const value = await stat(path.join(root, relativePath));
  return value.isFile() || value.isDirectory();
}

test("all JSON documents parse", async () => {
  for (const file of jsonFiles) {
    assert.doesNotReject(() => json(file), file);
  }
});

test("portable Agent Plugins manifests use v1 and the production endpoint", async () => {
  const manifest = await json("plugin.json");
  const mcp = await json("mcp.json");

  assert.equal(manifest.$schema, "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json");
  assert.equal(manifest.name, "actwise-ideation");
  assert.deepEqual(Object.keys(manifest).sort(), [
    "$schema",
    "author",
    "description",
    "homepage",
    "keywords",
    "license",
    "name",
    "repository",
    "version"
  ]);
  assert.equal(mcp.$schema, "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json");
  assert.equal(mcp.mcpServers["actwise-ideation"].type, "streamable-http");
  assert.equal(mcp.mcpServers["actwise-ideation"].url, endpoint);
});

test("compatibility manifests agree on endpoint and version", async () => {
  const packageJson = await json("package.json");
  const packageLock = await json("package-lock.json");
  const portable = await json("plugin.json");
  const compatibilityMcp = await json(".mcp.json");
  const codex = await json(".codex-plugin/plugin.json");
  const grok = await json(".grok-plugin/plugin.json");
  const claude = await json(".claude-plugin/plugin.json");
  const claudeMarketplace = await json(".claude-plugin/marketplace.json");

  assert.equal(compatibilityMcp.mcpServers["actwise-ideation"].url, endpoint);
  assert.equal(compatibilityMcp.mcpServers["actwise-ideation"].type, "http");
  assert.equal(packageJson.engines.node, "23.6.1");
  assert.equal(packageJson.version, portable.version);
  assert.equal(packageLock.version, portable.version);
  assert.equal(codex.version, portable.version);
  assert.equal(grok.version, portable.version);
  assert.equal(claude.version, portable.version);
  assert.equal(claudeMarketplace.plugins[0].version, portable.version);
  assert.equal(portable.repository, repository);
  assert.equal(codex.repository, repository);
  assert.equal(grok.repository, repository);
  assert.equal(claude.repository, repository);
  assert.equal(claudeMarketplace.plugins[0].repository, repository);
});

test("declared local component paths exist", async () => {
  const codex = await json(".codex-plugin/plugin.json");
  const grok = await json(".grok-plugin/plugin.json");
  const claude = await json(".claude-plugin/plugin.json");
  const codexMarketplace = await json(".agents/plugins/marketplace.json");

  for (const manifest of [codex, grok, claude]) {
    assert.equal(await exists(manifest.skills), true, manifest.skills);
    assert.equal(await exists(manifest.mcpServers), true, manifest.mcpServers);
  }
  assert.equal(codexMarketplace.plugins[0].source.path, "./");
  assert.equal(await exists(codex.interface.composerIcon), true, codex.interface.composerIcon);
  assert.equal(await exists(codex.interface.logo), true, codex.interface.logo);
  assert.equal(await exists(grok.logo), true, grok.logo);
});

test("canonical skill has valid minimal frontmatter and safety boundaries", async () => {
  const skill = await read("skills/actwise-ideation/SKILL.md");
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---/);

  assert.ok(frontmatter, "SKILL.md frontmatter is missing");
  const fields = frontmatter[1].split("\n").map((line) => line.split(":", 1)[0]);
  assert.deepEqual(fields, ["name", "description"]);
  assert.match(skill, /name: actwise-ideation/);
  assert.match(skill, /Preview by default/);
  assert.match(skill, /explicitly requests or authorizes an official evaluation/);
  assert.match(skill, /presentation\.rendered_markdown/);
  assert.match(skill, /Never fabricate an evaluation/);
});

test("repository contains no obvious secrets, unfinished placeholders, or em dashes", async () => {
  const textFiles = [
    "README.md",
    ".nvmrc",
    "plugin.json",
    "mcp.json",
    ".mcp.json",
    ".codex-plugin/plugin.json",
    ".grok-plugin/plugin.json",
    "assets/brand/actwise-logo.svg",
    "assets/brand/actwise-icon.svg",
    ".agents/plugins/marketplace.json",
    ".claude-plugin/plugin.json",
    ".claude-plugin/marketplace.json",
    "skills/actwise-ideation/SKILL.md",
    "docs/chatgpt/README.md",
    "docs/claude-code/README.md",
    "docs/cursor/README.md",
    "docs/devin/README.md",
    "docs/grok-build/README.md"
  ];
  const forbidden = [
    /TODO/i,
    /FIXME/i,
    /BEGIN (?:RSA|OPENSSH|EC) PRIVATE KEY/,
    /(?:api[_-]?key|client[_-]?secret|access[_-]?token)\s*[:=]\s*["'][^"']+["']/i,
    /github\.com\/actwise\/actwise-ideation-plugin/i,
    /\u2014/
  ];

  for (const file of textFiles) {
    const contents = await read(file);
    for (const pattern of forbidden) {
      assert.doesNotMatch(contents, pattern, `${file} matched ${pattern}`);
    }
  }
});

test("Devin documentation and the CLI gate cover plugin and MCP installation", async () => {
  const readme = await read("README.md");
  const guide = await read("docs/devin/README.md");
  const workflow = await read(".github/workflows/verify-cli-installs.yml");
  const pluginCommand = "devin plugins install actwiseai/actwise-ideation-plugin";
  const mcpCommand = `devin mcp add actwise-ideation ${endpoint}`;

  assert.match(readme, new RegExp(pluginCommand.replaceAll("/", "\\/")));
  assert.match(readme, new RegExp(mcpCommand.replaceAll("/", "\\/")));
  assert.match(guide, new RegExp(pluginCommand.replaceAll("/", "\\/")));
  assert.match(guide, new RegExp(mcpCommand.replaceAll("/", "\\/")));
  assert.match(guide, /devin mcp login actwise-ideation/);
  assert.match(workflow, /name: Devin CLI/);
  assert.match(workflow, /DEVIN_VERSION: 3000\.4\.25/);
  assert.match(workflow, /sha256sum --check/);
  assert.doesNotMatch(workflow, /cli\.devin\.ai\/install\.sh/);
  assert.match(workflow, /devin plugins install "\$PLUGIN_REPOSITORY" -y/);
  assert.match(workflow, /devin plugins install \. -y/);
  assert.match(workflow, /needs\.devin\.result/);
});
