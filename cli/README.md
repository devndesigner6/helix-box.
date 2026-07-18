# Lunel CLI

Node.js CLI that connects a local machine to the Lunel mobile app through the Lunel gateway. It runs from the project directory you want to expose and keeps filesystem, terminal, process, port, git, and AI actions scoped to that working tree.

## Requirements

- Node.js 18 or newer
- npm
- Lunel mobile app for QR/session pairing

## Usage

Run the published package:

```bash
npx lunel-cli
```

The CLI prints a QR code and session details. Scan the QR code with the Lunel app to connect to the current working directory.

Common options:

```bash
npx lunel-cli --help
npx lunel-cli --new
npx lunel-cli --debug
npx lunel-cli --extra-ports 3000,8080
```

Options:

| Option | Description |
| --- | --- |
| `-h`, `--help` | Show CLI help |
| `-n`, `--new` | Create a fresh session code instead of reusing the saved one |
| `-d`, `--debug` | Enable verbose CLI and AI backend logs |
| `--extra-ports` | Comma-separated local ports to expose through Lunel |

## Configuration

By default, the CLI uses the public Lunel services:

- Gateway: `https://gateway.lunel.dev`
- Manager: `https://manager.lunel.dev`

Override them with environment variables when developing against local or custom infrastructure:

```bash
LUNEL_PROXY_URL=http://localhost:3001 \
LUNEL_MANAGER_URL=http://localhost:3002 \
npx lunel-cli
```

Other useful environment variables:

| Variable | Description |
| --- | --- |
| `LUNEL_PROXY_URL` | Gateway/proxy URL |
| `LUNEL_MANAGER_URL` | Manager URL |
| `LUNEL_DEBUG` | Set to `1` for debug logging |
| `LUNEL_DEBUG_AI` | Set to `1` for AI backend debug logging |
| `NO_COLOR` | Disable colored terminal output |
| `FORCE_COLOR` | Force colored terminal output |

Session config is saved per project root in the OS-specific Lunel config directory:

- macOS: `~/Library/Application Support/lunel/config.json`
- Windows: `%APPDATA%\lunel\config.json`
- Linux: `$XDG_CONFIG_HOME/lunel/config.json` or `~/.config/lunel/config.json`

## Development

Install dependencies:

```bash
npm install
```

Build the CLI:

```bash
npm run build
```

Run from source output:

```bash
npm run dev
```

The package entrypoint is `dist/index.js`, generated from `src/index.ts`. `npm run build` compiles TypeScript and marks the generated entrypoint executable.

## Project Layout

```text
src/
  index.ts              CLI entrypoint and local machine bridge
  ai/                   Codex/OpenCode provider integration
  transport/            Session transport protocol
  libsodium-wrappers.d.ts
```

## Publishing

The package is published as `lunel-cli`. `prepublishOnly` runs the production build before publishing.

```bash
npm publish
```
