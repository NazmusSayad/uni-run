# uni-run

A universal CLI tool to run scripts in any language — JavaScript, TypeScript, Python, Java, C, C++, Rust, Go, Ruby, PHP, Dart, Lua, and more. One command, any script, with watch mode, benchmarking, and automatic runtime detection.

## Features

- **19+ languages** supported out of the box, including compiled languages (C, C++, Rust, C#)
- **Watch mode** — automatically re-runs on file changes with `.gitignore`-aware filtering
- **Reload keys** — press Ctrl+R or F5 to re-run without saving
- **Benchmarking** — measure execution time with `--bench`
- **Configurable runtimes** — swap between `node`/`bun`/`deno`, `python`/`uv`, and more via `~/.uni-run.json`
- **Environment variables** — inject env vars with `--env KEY=VALUE`
- **Exec mode** — run any arbitrary binary with `run exec`
- **Cross-platform** — works on Windows, macOS, and Linux

## Installation

```sh
npm install -g uni-run
```

## CLI Usage

```sh
run <script> [options] -- [args for script]
uni-run <script> [options] -- [args for script]
```

`rux` / `uni-rux` are aliases that run once and exit (no watch mode, keeps console output):

```sh
rux <script> [options] -- [args for script]
uni-rux <script> [options] -- [args for script]
```

### Examples

```sh
run ./main.ts
run ./main.py
run ./Main.java
run ./hello.c
run ./main.js -- --port 3000
```

### Subcommands

```sh
run exec <binary> [args]     # Execute an arbitrary binary
run list                     # List all supported script types
run clean                    # Clean the temp/cache directory
```

## Options

### Watch Mode

| Flag                     | Alias | Description                                 |
| ------------------------ | ----- | ------------------------------------------- |
| `--do-not-watch`         | `-dw` | Disable watch mode                          |
| `--ext <exts...>`        | `-e`  | Watch only specific extensions              |
| `--focus <paths...>`     | `-f`  | Watch only specific paths (chokidar syntax) |
| `--ignore <patterns...>` | `-ig` | Exclude paths (.gitignore syntax)           |
| `--delay <ms>`           | `-d`  | Debounce delay in ms (default: 100)         |

### Reload / Console

| Flag                   | Alias  | Description                   |
| ---------------------- | ------ | ----------------------------- |
| `--disable-reload-key` | `-dk`  | Disable Ctrl+R / F5 reload    |
| `--disable-raw-stdin`  | `-drs` | Disable raw stdin mode        |
| `--keep`               | `-k`   | Don't clear console on reload |
| `--silent`             | `-s`   | Suppress script output        |

### Execution

| Flag                   | Description                           |
| ---------------------- | ------------------------------------- |
| `--exit`               | Run once and exit (default for `rux`) |
| `--shell`              | Run in shell mode                     |
| `--cwd <path>`         | Set working directory                 |
| `--env <KEY=VALUE...>` | Set environment variables             |
| `--node-dev`           | Set `NODE_ENV=development`            |

### Benchmarking / Info

| Flag                    | Alias | Description                        |
| ----------------------- | ----- | ---------------------------------- |
| `--bench`               | `-b`  | Show execution time                |
| `--bench-prefix <text>` | `-bp` | Custom prefix for benchmark output |
| `--info`                |       | Show execution information         |
| `--time`                |       | Show start time                    |

## Configuration

Create `~/.uni-run.json` to override default runtimes:

```json
{
  "$schema": "https://github.com/NazmusSayad/uni-run/raw/refs/heads/main/public/uni-run.schema.json",
  "runtime": {
    "python": "uv",
    "javascript": "bun",
    "typescript": "deno"
  }
}
```

### Configurable Runtimes

| Language   | Options                         | Default      |
| ---------- | ------------------------------- | ------------ |
| JavaScript | `node`, `deno`, `bun`           | `node`       |
| TypeScript | `tsx`, `ts-node`, `deno`, `bun` | `tsx`        |
| Python     | `python`, `python3`, `uv`       | `python`     |
| Dart       | `dart`, `dartvm`                | `dart`       |
| PowerShell | `powershell`, `pwsh`            | `powershell` |
| Shell      | `bash`, `zsh`, `sh`             | `bash`       |
| Lua        | `lua`, `luac`, `luajit`         | `lua`        |

## Supported Languages

| Language           | Extensions                                 |
| ------------------ | ------------------------------------------ |
| JavaScript         | `.js` `.jsx` `.mjs` `.cjs` `.cjsx` `.mjsx` |
| TypeScript         | `.ts` `.tsx` `.mts` `.cts` `.mtsx` `.ctsx` |
| Python             | `.py`                                      |
| Java               | `.java`                                    |
| Dart               | `.dart`                                    |
| PowerShell         | `.ps1`                                     |
| Command Prompt     | `.cmd` `.bat`                              |
| Shell Script       | `.sh`                                      |
| Fish Shell         | `.fish`                                    |
| Lua                | `.lua`                                     |
| Ruby               | `.rb`                                      |
| Go                 | `.go`                                      |
| C (GCC)            | `.c`                                       |
| C++ (G++)          | `.cpp`                                     |
| C# (Mono)          | `.cs`                                      |
| Rust (rustc)       | `.rs`                                      |
| SASS/SCSS          | `.sass` `.scss`                            |
| PHP                | `.php`                                     |
| HTML (live-server) | `.html` `.htm`                             |

Compiled languages (C, C++, C#, Rust) are compiled to a temp directory and executed automatically. Use `run clean` to remove compiled artifacts.
