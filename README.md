# uni-run

`uni-run` is a versatile CLI tool designed to run various types of scripts, including but not limited to JavaScript, TypeScript, Python, Java, HTML, SASS, Lua and more. It provides a unified interface to execute scripts with additional features like watching for file changes, benchmarking execution time, and more.

## Features

- **Watch Mode**: Automatically re-run scripts when files change.
- **Benchmarking**: Measure and display the execution time of scripts.
- **Environment Variables**: Set environment variables for the script execution.
- **Shell Execution**: Run scripts in a shell for more control.
- **Console Clearing**: Clear the console before running the script.
- **Reload Key**: Enable reloading the script with a specific key combination.
- **Information Display**: Show detailed information about the script execution.

## Installation

To install `uni-run`, use npm:

```sh
npm install -g uni-run
```

## CLI Usage

### Basic Command

To run a script, use the following command:

```sh
run script.ext [options] -- [args for internal bin]
uni-run script.ext [options] -- [args for internal bin]
```

### Examples

#### Running a JavaScript File

```sh
run ./scripts/main.js
```

#### Running a TypeScript File

```sh
run ./scripts/main.ts
```

#### Running a Python File

```sh
run ./scripts/main.py
```

#### Running a Java File

```sh
run ./scripts/Main.java
```

#### Running with script argv

```sh
run ./scripts/main.js -- --some someValue
```

Here `--some someValue` will be passed to `node` and will be ignored by uni-run.

## API

The `uni-run` package provides a simple API to manage and execute scripts.

#### `addBin(bin: Executor)`:

The `Executor` class is imported from `uni-run` and is used to manage script execution.
Adds a new `Executor` instance to the list of built-in binaries.

```typescript
import uniRun, { Executor } from 'uni-run'

const executor = new Executor('Name', {
  extensions: ['something'],
  run(args, options) {
    return ['something-binary', ...args]
  },
})

uniRun.addBin(executor)
```

#### `start(args?: string[])`:

Starts the application with the provided arguments.

```typescript
import uniRun from 'uni-run'

uniRun.start(['arg1', 'arg2'])
```

### Example Usage

```typescript
import uniRun, { Executor } from 'uni-run'

// Create a new Executor instance
const executor = new Executor('Name', {
  extensions: ['some'],
  run(args, options) {
    return ['something-binary', ...args]
  },
})

// Add the Executor to uni-run
uniRun.addBin(executor)

// Start the application with arguments
uniRun.start(['arg1.some'])
```
