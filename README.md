# uni-run

`uni-run` is a versatile CLI tool designed to run various types of scripts, including but not limited to JavaScript, TypeScript, Python, Java, HTML, SASS, Lua, and more. It provides a unified interface to execute scripts with additional features like watching for file changes, benchmarking execution time, and more.

## Features

- **Watch Mode**: Automatically re-run scripts when files change.
- **Benchmarking**: Measure and display the execution time of scripts.
- **Environment Variables**: Set environment variables for script execution.
- **Shell Execution**: Run scripts in a shell for more control.
- **Console Clearing**: Clear the console before running the script.
- **Reload Key**: Enable reloading the script with Ctrl+R or F5.
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
rux script.ext [options] -- [args for internal bin]
uni-rux script.ext [options] -- [args for internal bin]
```

Note: `rux` and `uni-rux` run scripts once and exit (no watch mode by default).

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

Here `--some someValue` will be passed to `node` and will be ignored by `uni-run`.

#### Executing with a custom binary

```sh
run exec python ./scripts/custom.py
run exec custom-binary arg1 arg2
```

#### Listing supported scripts

```sh
run list
```

#### Cleaning cache

```sh
run clean
```

## Define Custom Configuration

Create `.uni-run.json` file in your user home directory or current working directory.

```json
{
  "javascript-runtime": "bun",
  "typescript-runtime": "deno"
}
```

Now you can run your script with `run script.js` or `run script.ts` with your own runtime.

## Setup Custom Executors

Create `.uni-run.cjs` file in your user home directory or current working directory.
NOTE: Your custom executors will have more priority than the default executors.

```js
module.exports = [
  {
    name: 'Name',
    exts: ['ext'],
    getRuntime(args, options, config) {
      return {
        exec: ['YOUR_BIN', ...args],
      }
    },
  },
]
```

Now you can run your script with `run script.ext`.

## API

The `uni-run` package provides a simple API to manage and execute scripts.

#### `addExecutorBefore(options: ExecutorOptions)` or `addExecutorAfter(options: ExecutorOptions)`:

Both methods add an executor to the list of executors. The `addExecutorBefore` method adds the executor before the default executors, while the `addExecutorAfter` method adds the executor after the default executors. This means that the executor will be used before or after checking the default executors.

```typescript
import uniRun from 'uni-run'

uniRun.addExecutorBefore({
  name: 'Name',
  exts: ['ext'],
  getRuntime(args, options, config) {
    return {
      exec: ['YOUR_BIN', ...args],
    }
  },
})
```

#### `start(args?: string[])`:

Starts the application with the provided arguments. If no arguments are provided, it inherits from CLI.

```typescript
import uniRun from 'uni-run'

uniRun.start(['arg1', 'arg2'])
```

### Exports

The package also exports the following utilities:

- `currentModule` - Get the current module information
- `getConfig(cwd?: string)` - Get configuration from `.uni-run.json`
- `getUserExecutors(cwd?: string)` - Get user-defined executors from `.uni-run.cjs`
- `ScriptExecutorOptions` and other types from `./scriptExecutors/types.t`

```typescript
import { getConfig, getUserExecutors } from 'uni-run'

const config = getConfig('/path/to/project')
const executors = getUserExecutors('/path/to/project')
```

### Example Usage

```typescript
import uniRun from 'uni-run'

// Add the Executor to uni-run
uniRun.addExecutorBefore({
  name: 'Name',
  exts: ['ext'],
  getRuntime(args, options, config) {
    return {
      exec: ['YOUR_BIN', ...args],
    }
  },
})

// Start the application with arguments
uniRun.start(['arg1.some'])

// Or inherit from CLI
uniRun.start()
```
