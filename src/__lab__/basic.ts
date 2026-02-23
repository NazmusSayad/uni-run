import { app } from '@/app/handlers/app'

app.start(['exec', 'node', '--', '--version'])
