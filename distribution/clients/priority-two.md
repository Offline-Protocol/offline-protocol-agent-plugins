# Priority-two client setup

Each file here connects one client to the Offline Protocol developer MCP. Local files run `npx -y @offline-protocol/cli@0.2.6 mcp serve` and need no credentials. Hosted files use `https://mcp.offlineprotocol.com/mcp` with an application API key and the matching application id; hosted mode has no `scaffold_project`, `integrate_packages` or `init_project`. Never commit real keys.

## Continue

- Local: `continue.yaml`. Hosted: `continue-hosted.yaml`.
- In the IDE extensions, save the file as `.continue/mcpServers/<name>.yaml` in the workspace, or paste its `mcpServers` list into `config.yaml`.
- The hosted file reads `${{ secrets.OFFLINE_PROTOCOL_API_KEY }}` and `${{ secrets.OFFLINE_PROTOCOL_APP_ID }}`. The Continue CLI (`cn`) resolved both from environment variables in testing. MCP tools are available in agent mode.
- The CLI does not load workspace `.continue/mcpServers/` blocks; put the `mcpServers` entry in the file passed with `--config`.

## Zed

- Local: `zed.json`. Hosted: `zed-hosted.json`. Merge the `context_servers` object into Zed settings (`zed: open settings file`), or use Settings, AI, MCP Servers, Add Server.
- Zed prompts for OAuth when a remote server has no `Authorization` header. Keep the header in place for the hosted endpoint, which does not offer OAuth.
- An MCP server extension is not recommended: Zed plans to deprecate MCP server extensions in favor of the official MCP Registry (https://zed.dev/docs/extensions/mcp-extensions). Publish `distribution/mcp-registry/` instead.

## Windsurf and Devin Desktop

- Local: `devin-desktop.json`. Hosted: `devin-desktop-hosted.json`.
- The legacy Cascade agent and the Devin Local agent (default in new Devin Desktop tabs) both read `~/.config/devin/mcp_config.json` (`%APPDATA%\devin\mcp_config.json` on Windows). The Devin CLI also reads `.devin/mcp_config.json` and the gitignored `.devin/mcp_config.local.json`.
- The hosted file uses `url` (accepted by Cascade, required by the Devin CLI) and `${env:...}` interpolation, which Cascade documents for `headers`. For the Devin CLI, prefer literal values in `.devin/mcp_config.local.json`.
- Devin CLI shortcut for local mode: `devin mcp add -s user offline-protocol -- npx -y @offline-protocol/cli@0.2.6 mcp serve`.
- Devin Local asks for approval before each MCP tool call by default. Cascade has a 100-tool limit across all servers.

## Devin (cloud)

Customize, MCPs, Add custom MCP (needs the Manage MCP Servers permission):

| Field | Local | Hosted |
| --- | --- | --- |
| Server name | Offline Protocol | Offline Protocol (hosted) |
| Transport | STDIO | HTTP (Streamable HTTP) |
| Command / URL | `npx` | `https://mcp.offlineprotocol.com/mcp` |
| Arguments | `-y @offline-protocol/cli@0.2.6 mcp serve` | |
| Authentication | none | Auth Header: `Authorization` = `Bearer <application API key>` |
| Headers | | `x-app-id` = `<application id>` |

Store the key with Devin Secrets. In cloud Devin, local mode writes files inside Devin's own machine, which is where it builds. Devin documents no vendor submission route; the documented options are Suggest MCP Integration in the product or support@cognition.ai.

## xAI API (Grok remote MCP)

`xai-responses.json` is a request body for `POST https://api.x.ai/v1/responses`. xAI connects to the MCP server itself, so only the hosted endpoint works.

```bash
curl https://api.x.ai/v1/responses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $XAI_API_KEY" \
  -d @distribution/clients/xai-responses.json
```

- xAI documents `authorization` as "a token that will be set in the Authorization header". The file passes the raw application API key there, following the OpenAI Responses convention of adding the `Bearer ` scheme; this is not yet confirmed against xAI. `headers` carries `x-app-id`. In the xAI Python SDK the fields are `mcp(server_url=..., server_label=..., authorization=..., extra_headers={...}, allowed_tool_names=[...])`.
- `allowed_tools` lists the 15 hosted tools so Grok never sees the excluded local ones.
- Not called: this needs an xAI API key and an Offline Protocol application key. If the server returns 401 with `authorization`, move the key into `headers` as `"Authorization": "Bearer <key>"`.
- This is the xAI developer API. It is not a listing in the Grok consumer apps.

## Cline hosted (manual)

The Cline Marketplace entry installs local mode (`distribution/cline/`). For hosted mode:

```bash
cline mcp install offline-protocol-hosted --transport http https://mcp.offlineprotocol.com/mcp \
  --header "Authorization: Bearer <application API key>" --header "x-app-id: <application id>"
```

Cline 3.0.65 stores and sends header values literally; `${VAR}` is not expanded.
