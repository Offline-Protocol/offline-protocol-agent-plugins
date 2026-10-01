# Install Offline Protocol in Gemini CLI, Cursor and VS Code

Each setup below adds the Offline Protocol developer MCP server to your coding agent. The agent can then find compatible Offline Protocol packages, read integration guides and workflows, plan an integration, and (in local mode) scaffold or integrate a project.

These tools help you build an application. They do not discover nearby devices, operate a mesh or control live hardware.

## Local or hosted

| | Local (default) | Hosted |
| --- | --- | --- |
| Runs | `npx -y @offline-protocol/cli@0.2.6 mcp serve` on your machine, over stdio | `https://mcp.offlineprotocol.com/mcp` over Streamable HTTP |
| Needs | Node.js 18 or later with npx. The first run downloads the pinned CLI from npm | An Offline Protocol application API key and its matching application ID. Organization keys are rejected |
| Account | None | Offline Protocol developer account |
| Tools | All 18 tools | Excludes `scaffold_project`, `integrate_packages` and `init_project` |
| Files | Can write scaffolds and integration changes in your workspace | Read-only guidance; cannot scaffold or edit your workspace |

Use local mode unless you specifically need the hosted service. Never commit an API key: the hosted examples below read it from an environment variable or a masked prompt.

## Gemini CLI

The repository root is a Gemini CLI extension (`gemini-extension.json`). It starts the local MCP server and loads the Build with Offline Protocol instructions as extension context.

Install:

```sh
gemini extensions install https://github.com/Offline-Protocol/offline-protocol-agent-plugins
```

Or clone the repository and install from the checkout:

```sh
git clone https://github.com/Offline-Protocol/offline-protocol-agent-plugins.git
gemini extensions install ./offline-protocol-agent-plugins
```

Gemini CLI asks you to trust the extension source and shows a third-party extension notice. For development, `gemini extensions link ./offline-protocol-agent-plugins` uses the checkout in place.

Check it:

```sh
gemini extensions list   # offline-protocol, with the SKILL.md context file and the offline-protocol MCP server
gemini mcp list          # offline-protocol ... - Connected
```

In a session, `/mcp list` shows `offline-protocol - Ready (18 tools, 3 prompts, 37 resources)`. Gemini CLI disables MCP servers in folders you have not trusted; if the server shows as Disabled, trust the project folder.

Hosted instead of local: add this to `~/.gemini/settings.json` (Gemini CLI expands `${VAR}` from your environment) and set the two variables in your shell.

```json
{
  "mcpServers": {
    "offline-protocol-hosted": {
      "httpUrl": "https://mcp.offlineprotocol.com/mcp",
      "headers": {
        "Authorization": "Bearer ${OFFLINE_PROTOCOL_API_KEY}",
        "x-app-id": "${OFFLINE_PROTOCOL_APP_ID}"
      }
    }
  }
}
```

## Cursor

Cursor can use the Offline Protocol plugin (skill plus MCP server) or the MCP server alone.

**Plugin.** After the plugin is listed, install Offline Protocol from the Cursor Marketplace. The plugin lives in `plugins/offline-protocol`; `.cursor-plugin/marketplace.json` at the repository root points Cursor to it and supplies the listing logo. To try it before listing, run the Cursor CLI with the plugin directory from a checkout (requires `cursor-agent login`):

```sh
cursor-agent --plugin-dir ./plugins/offline-protocol
```

**MCP server only.** Put the contents of [`mcp-stdio.json`](mcp-stdio.json) in `.cursor/mcp.json` for one project, or in `~/.cursor/mcp.json` for all projects. If the file already exists, merge the `offline-protocol` entry into `mcpServers`. You can also open this install link in Cursor:

```text
cursor://anysphere.cursor-deeplink/mcp/install?name=offline-protocol&config=eyJjb21tYW5kIjoibnB4IiwiYXJncyI6WyIteSIsIkBvZmZsaW5lLXByb3RvY29sL2NsaUAwLjIuNiIsIm1jcCIsInNlcnZlIl19
```

Check it with the Cursor CLI (no Cursor login is needed for these two commands):

```sh
cursor-agent mcp enable offline-protocol          # approve the server
cursor-agent mcp list-tools offline-protocol      # Tools for offline-protocol (18)
```

In the Cursor editor, check the MCP section of Cursor Settings and confirm `offline-protocol` is enabled.

Hosted instead of local (`.cursor/mcp.json` or `~/.cursor/mcp.json`; Cursor resolves `${env:NAME}` in headers):

```json
{
  "mcpServers": {
    "offline-protocol-hosted": {
      "url": "https://mcp.offlineprotocol.com/mcp",
      "headers": {
        "Authorization": "Bearer ${env:OFFLINE_PROTOCOL_API_KEY}",
        "x-app-id": "${env:OFFLINE_PROTOCOL_APP_ID}"
      }
    }
  }
}
```

## VS Code with GitHub Copilot

VS Code reads MCP servers from `mcp.json` with a top-level `servers` object. Use them from Copilot Chat in agent mode.

Add to your user profile from a terminal:

```sh
code --add-mcp '{"name":"offline-protocol","type":"stdio","command":"npx","args":["-y","@offline-protocol/cli@0.2.6","mcp","serve"]}'
```

Or open this install link, which asks VS Code to install the same server:

```text
vscode:mcp/install?%7B%22name%22%3A%22offline-protocol%22%2C%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40offline-protocol%2Fcli%400.2.6%22%2C%22mcp%22%2C%22serve%22%5D%7D
```

On web pages where `vscode:` links are not clickable (such as GitHub READMEs), use the web redirect, which opens the same install link:

```text
https://vscode.dev/redirect/mcp/install?name=offline-protocol&config=%7B%22type%22%3A%22stdio%22%2C%22command%22%3A%22npx%22%2C%22args%22%3A%5B%22-y%22%2C%22%40offline-protocol%2Fcli%400.2.6%22%2C%22mcp%22%2C%22serve%22%5D%7D
```

For one workspace, copy [`vscode.json`](vscode.json) to `.vscode/mcp.json` (merge into `servers` if the file exists). Workspace servers start once you trust the workspace; user-profile servers ask for trust on first start. Run **MCP: List Servers** to start or inspect `offline-protocol`, then pick its tools in the Chat tools menu.

Hosted instead of local (`.vscode/mcp.json` or the user `mcp.json`; VS Code prompts for both values and stores them securely):

```json
{
  "inputs": [
    { "type": "promptString", "id": "offline-protocol-api-key", "description": "Offline Protocol application API key", "password": true },
    { "type": "promptString", "id": "offline-protocol-app-id", "description": "Offline Protocol application ID" }
  ],
  "servers": {
    "offline-protocol-hosted": {
      "type": "http",
      "url": "https://mcp.offlineprotocol.com/mcp",
      "headers": {
        "Authorization": "Bearer ${input:offline-protocol-api-key}",
        "x-app-id": "${input:offline-protocol-app-id}"
      }
    }
  }
}
```

## First task to try

"Add an encrypted local handoff to this React Native app. Explain the device requirements, choose compatible Offline Protocol packages, and show how the receiving app will persist the handoff."
