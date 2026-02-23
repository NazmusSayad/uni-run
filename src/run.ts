#!/usr/bin/env node

import { app } from './app/handlers/app'

import './app/handlers/etc'

app.start(process.argv.slice(2))
