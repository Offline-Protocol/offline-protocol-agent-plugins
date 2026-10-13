---
name: build-with-offline-protocol
description: Integrate Offline Protocol SDKs into applications for local device communication, shared data, nearby services, or OfflineID authentication. Use when the user asks to build with Offline Protocol or evaluate it for a concrete workflow.
---

# Build with Offline Protocol

Use the `offline-protocol` MCP server to retrieve the packages and integration guidance for the user's target platform. These tools help build applications; they do not run a mesh, discover real devices, or invoke a nearby device.

If the `offline-protocol` tools are not available in this session (claude.ai chat, for example, does not start local MCP servers), say so. Point the user to https://www.offlineprotocol.com/docs/tools/overview and do not guess package names, versions or APIs.

## Choose the integration

Establish the existing app framework, device operating systems, available radios, and the action the user needs to complete. Read the repository first when it already answers those questions.

Use `search_capabilities` or `search_workflows` with that outcome, then `get_workflow`, `get_package`, and `get_skill` for the relevant results. Retrieve current tool schemas before calling them. Do not assume a workflow or package exists because its name sounds plausible. Use `resolve_packages` for the target platform and install requirements. If the registry does not cover the platform, state that gap and consult https://www.offlineprotocol.com/docs/getting-started/platforms. For frameworks the planner has no starter for, such as Flutter or native Kotlin or Swift, `generate_architecture`, `preview_scaffold` and `scaffold_project` return that limitation instead of a plan; pass `platform` explicitly only when the user chooses a supported framework, and compare the returned `platform` with the user's framework before proceeding.

The registry is bundled with the CLI release. Check version-specific public documentation and published package versions before using newer APIs or presenting a template as production-ready. The live agent setup instructions are at https://dev.offlineprotocol.com/agent-setup/prompt.md.

## Implement the user's workflow

For a new project, inspect `get_template` and `preview_scaffold` before using `scaffold_project`. For an existing application, use `init_project` or `integrate_packages` only within the requested integration scope and inspect the resulting diff. `offline init` requires an existing JavaScript or TypeScript project with package.json. Preserve unrelated app code and dependencies.

For retained events and handoffs, distinguish receipt by an SDK from persistence by the receiving application and acceptance by its backend. Design application-level event IDs, durable storage and idempotent acceptance where the workflow needs recovery. A delivered message alone does not establish that an order printed, an event reached a database, or an actuator completed an action.

The registry bundled with this CLI release pins Mesh SDK 0.29.0; telemetry in the React Native scaffolds is optional hosted upload (`enableTelemetry`) kept in `src/diagnostics.ts`, separate from networking. npm may publish newer releases. From Mesh SDK 0.28.0, Wi-Fi Direct is opt-in and forms groups between Android phones only and iPhones use a Network framework peer stream; from 0.29.0 Android also joins that slot on a shared Wi-Fi network, and otherwise an Android phone and an iPhone meet over BLE or a configured relay, so the React Native scaffolds keep `wifiDirect` disabled; read the `mesh-networking` skill before enabling it. A failed printer LAN still requires a working path to the printer, such as an existing USB-connected kitchen device. Do not promise that software replaces a missing radio or physical connection.

Registry samples can lag the published packages, so check SDK calls against the installed type definitions. Facts that samples written elsewhere often get wrong: Mesh SDK event payloads use snake_case fields (`message_id`, `peer_id`, `file_id`); `protocol.on()` returns the protocol, so remove listeners with `protocol.off()`; `priority` takes the `MessagePriority` enum. The published web `@offline-protocol/id-react` 0.2.0 uses `appId` on `OfflineAppProvider` (`projectId` is deprecated). `@offline-protocol/id-react-native` is pinned at 0.3.3 in the CLI registry (appId from 0.3.2+). Flutter has no Offline Protocol package. Python (`offline-protocol-sdk` on PyPI) and Rust (`offline-protocol` on crates.io) cover servers and desktops; with the `http` extra the Python service also serves an HTTP front, so programs that do not use the SDK call services on other devices with plain HTTP (see the `http-front` skill). Native Swift (`offline-protocol-swift`, a Swift package) and Kotlin (`offline-protocol-android`, a GitHub release download that is not on Maven Central) are early previews in which the app wires transports and storage itself and API names may change. `offline-protocol-leaf` compiles for ESP32 and Cortex-M targets but has not run on a board, so do not present a microcontroller as a working peer. The planning tools have no starter for any of these and return that limitation instead of a plan, so tell the user rather than switching frameworks silently. `.mcp.json` files written by `init_project` or a scaffold register the same pinned npx server; when this plugin already provides the server, do not add a second copy.

## Verify and hand off

Run the checks appropriate to the edited application. State separately what compiled, what ran locally, and what was verified on physical devices. For an outage workflow, include restart, retry and recovery checks tied to the application's acceptance condition.

Local MCP uses stdio and needs no Offline Protocol account or key. Hosted MCP at https://mcp.offlineprotocol.com/mcp requires an application API key and matching x-app-id; organization keys are rejected. Hosted MCP does not expose scaffold_project, integrate_packages or init_project. Never put a key in committed configuration or substitute the SDK's runtime relay endpoint for this developer MCP server.
