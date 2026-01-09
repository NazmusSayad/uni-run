#!/usr/bin/env node

import './app'
import { app } from './arg'
import { setRuntime } from './local-env'

setRuntime('rux')
app.start()
