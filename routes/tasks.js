import { Router } from 'express'
import { IssueController } from '../controllers/issues.js'

export const taskRouter = Router()

taskRouter.get('/', IssueController.convertAll)
