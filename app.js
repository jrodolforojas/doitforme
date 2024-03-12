import express, { json } from 'express'
import { taskRouter } from './routes/tasks.js'
import { corsMiddleware } from './middlewares/cors.js'
import 'dotenv/config'

const app = express()
app.use(json())
app.use(corsMiddleware())
app.disable('x-powered-by')

app.use('/tasks', taskRouter)

const PORT = process.env.PORT ?? 1234

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
