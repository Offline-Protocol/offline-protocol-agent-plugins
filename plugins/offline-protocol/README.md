# Build with Offline Protocol

Find the SDK packages and implementation guidance for an application, plan the integration, and scaffold supported projects from your coding agent.

This package runs the published Offline Protocol CLI's local MCP server. It does not operate a device fleet or expose live device controls. Node.js 18 or later and npm/npx must be available to the client. The first run downloads the pinned CLI release (`@offline-protocol/cli@0.2.6`) from npm; no Offline Protocol account is needed for local tools.

## Install

- Claude Code: `claude plugin marketplace add Offline-Protocol/offline-protocol-agent-plugins`, then `claude plugin install offline-protocol@offline-protocol`.
- Gemini CLI: `gemini extensions install https://github.com/Offline-Protocol/offline-protocol-agent-plugins`.
- Codex: clone the repository, run `codex plugin marketplace add ./offline-protocol-agent-plugins`, then `codex plugin add offline-protocol@offline-protocol`. Or add only the server: `codex mcp add offline-protocol -- npx -y @offline-protocol/cli@0.2.6 mcp serve`.
- Cursor: copy this folder into `~/.cursor/plugins/local/offline-protocol` and reload Cursor. Organization policies may disable local imports.
- Other MCP clients: see `distribution/clients` in this repository.

These commands change your own client configuration.

Try: “Add an encrypted local handoff to this React Native app. Explain the device requirements, choose compatible packages, and show how the receiving app will persist the handoff.”

## What this plugin runs, writes and fetches

- **Runs:** `npx -y @offline-protocol/cli@0.2.6 mcp serve`, a local stdio MCP server. The first launch downloads the pinned package from the npm registry (about 47 MB unpacked, with prebuilt binaries for macOS, Linux and Windows); later launches reuse the npm cache.
- **Reads:** the package, workflow, template and skill registry bundled inside that CLI release. Search and read tools make no network requests and need no Offline Protocol account or key.
- **Writes, only when the agent calls these tools:** `scaffold_project` creates a new project directory; `integrate_packages` edits the target project's `package.json`; `init_project` adds `offline.config.json`, adds `.mcp.json` only if none exists, and appends an Offline Protocol section to `AGENTS.md`. Use the dry-run options first and review the diff.
- **Fetches, only for React Native scaffolds:** `scaffold_project` prepares native `android/` and `ios/` shells. It first looks for a cached shell in `~/.offline/cache`, and otherwise runs `npx @react-native-community/cli init` to generate it (a tarball is downloaded only when `OFFLINE_RN_SHELL_URL` is set).
- **Sends:** no telemetry or analytics. The plugin does not contact Offline Protocol services, discover nearby devices, or control any device.

## Where it loads

In Claude Code, Codex and Cursor the skill and the local MCP tools both load. In claude.ai chat only the skill loads, because chat does not start local MCP servers; Cowork starts them only when the session runs on your computer. Without the tools, the skill tells the agent to say so and use the public documentation rather than guess package names or APIs.

## Privacy and security

The plugin sends no telemetry. Your agent client and model provider receive tool inputs and results under their own terms. Privacy policy: https://www.offlineprotocol.com/privacy. Security reports: security@offlineprotocol.com.
