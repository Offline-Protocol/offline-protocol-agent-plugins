# Offline Protocol agent plugins

Plugins, skills and MCP configuration that connect coding agents (Claude Code,
Codex, Cursor, Gemini CLI, VS Code, Cline, Devin and other MCP clients) to the
Offline Protocol developer tools. Your agent can find Offline Protocol SDK
packages, read integration guides and workflows, plan an implementation, and
scaffold or integrate a project on your machine.

Every configuration runs the local MCP server from the published Offline
Protocol CLI, `npx -y @offline-protocol/cli@0.2.6 mcp serve`, or
connects to the hosted MCP server at `https://mcp.offlineprotocol.com/mcp`.
The tools help you build an application. They do not discover nearby devices,
operate a mesh or control live hardware.

- Documentation: https://www.offlineprotocol.com/docs/tools/overview
- npm package: https://www.npmjs.com/package/@offline-protocol/cli

This repository is generated from the Offline Protocol CLI source by its
`export-agent-plugins.mjs` script. `SOURCE.json` records the source commit
and a sha256 for every file. Changes are made in the source and exported
here; pull requests to this repository are reviewed and applied upstream.

## Requirements

Node.js 18 or later with npx. The first run downloads the pinned CLI
(`@offline-protocol/cli@0.2.6`) from npm. Local tools need no Offline
Protocol account and send no telemetry. The hosted server needs an application
API key and its application ID from https://dev.offlineprotocol.com.

## Install

### Claude Code plugin

```bash
claude plugin marketplace add https://github.com/Offline-Protocol/offline-protocol-agent-plugins.git
claude plugin install offline-protocol@offline-protocol
```

### Codex

```bash
codex plugin marketplace add https://github.com/Offline-Protocol/offline-protocol-agent-plugins.git
codex plugin add offline-protocol@offline-protocol
```

Or add only the MCP server:

```bash
codex mcp add offline-protocol -- npx -y @offline-protocol/cli@0.2.6 mcp serve
```

### Cursor

Copy `plugins/offline-protocol` into `~/.cursor/plugins/local/offline-protocol`
and reload Cursor. For the MCP server alone, put the contents of
`distribution/clients/mcp-stdio.json` in `.cursor/mcp.json` or
`~/.cursor/mcp.json`, or use the install link in
`distribution/clients/README.md`.

### Gemini CLI extension

The repository root is a Gemini CLI extension (`gemini-extension.json`).

```bash
gemini extensions install https://github.com/Offline-Protocol/offline-protocol-agent-plugins
```

### VS Code with GitHub Copilot

```bash
code --add-mcp '{"name":"offline-protocol","type":"stdio","command":"npx","args":["-y","@offline-protocol/cli@0.2.6","mcp","serve"]}'
```

For one workspace, copy `distribution/clients/vscode.json` to `.vscode/mcp.json`.

### Cline

```bash
cline mcp install offline-protocol -- npx -y @offline-protocol/cli@0.2.6 mcp serve
```

### Devin

Devin CLI:

```bash
devin plugins install Offline-Protocol/offline-protocol-agent-plugins#plugins/offline-protocol
```

Devin (web): add a custom MCP server with transport stdio, command `npx` and
arguments `-y @offline-protocol/cli@0.2.6 mcp serve`. Devin Desktop:
`distribution/clients/devin-desktop.json`.

### Any other MCP client

Use this server definition (also in `distribution/clients/mcp-stdio.json`):

```json
{
  "mcpServers": {
    "offline-protocol": {
      "command": "npx",
      "args": ["-y", "@offline-protocol/cli@0.2.6", "mcp", "serve"]
    }
  }
}
```

Zed, Continue, xAI and hosted configurations are in
`distribution/clients/README.md` and `distribution/clients/priority-two.md`.

## What is in here

| Path | Contents |
| --- | --- |
| `plugins/offline-protocol/` | The plugin: manifests for Claude Code, Codex and Cursor, MCP configuration, the integration skill and the logo |
| `.claude-plugin/`, `.cursor-plugin/`, `.agents/plugins/` | Marketplace files that point at the plugin |
| `gemini-extension.json` | Gemini CLI extension manifest |
| `distribution/clients/` | Ready-to-merge MCP configuration for other clients |
| `distribution/cline/offline-protocol/` | Cline marketplace entry |
| `distribution/mcp-registry/` | Official MCP Registry records |
| `.github/workflows/validate.yml` | Checks that run on every push and pull request: file hashes against `SOURCE.json`, manifest consistency, registry schema validation and a secret scan |

Releases are tagged `v<version>`, where the version is the one in
`gemini-extension.json` and the plugin manifests. The plugin version is
separate from the CLI version it launches.

## License, privacy and security

The plugin files are licensed under the Apache License 2.0 (`LICENSE`). The
Offline Protocol CLI they launch is also Apache-2.0; SDKs it installs into your
projects keep their own licenses, reported by the `resolve_packages` tool.
The Offline Protocol name and logo are trademarks (`NOTICE`). Using hosted
Offline Protocol services is governed by the developer terms at
https://www.offlineprotocol.com/legal/developer-terms and the privacy policy
at https://www.offlineprotocol.com/privacy. Your agent client and model
provider handle tool inputs and results under their own terms.

Report security issues to security@offlineprotocol.com, not in public issues
(`SECURITY.md`).
