#!/usr/bin/env node

import { setSystemRuntime } from './helpers/hack'
setSystemRuntime('rux')

import { app } from './app/handlers/app'
app.start(process.argv.slice(2))
