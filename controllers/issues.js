import { IssueModel } from '../models/issue.js'

export class IssueController {
  static async convertAll (req, res) {
    await IssueModel.convertAll()
    res.json({
      message: 'Issues added to Notion and closed on GitHub.'
    })
  }
}
