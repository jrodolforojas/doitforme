import { closeIssue, getAuthenticatedUserIssues } from '../services/github.js'
import { addPageToDatabase, isPageUnique } from '../services/notion.js'
import { PRIORITIES, SPRINTS, TYPES } from '../utils/notion-const.js'

function getDatabaseId () {
  return process.env.NOTION_DATABASE_ID ?? ''
}

function convertIssues (issues) {
  const convertedIssues = issues.map((issue) => {
    const { number, title, body, labels: issueLabels, html_url: htmlUrl, repository } = issue

    const { name, owner: { login } } = repository

    const githubLabel = issueLabels.map((label) => label.name)[0]
    const type = TYPES[githubLabel] ?? TYPES.bug
    const priority = type === TYPES.bug ? PRIORITIES.high : PRIORITIES.low
    const sprint = SPRINTS['1.0.1']

    return {
      id: number,
      title,
      body,
      type,
      priority,
      sprint,
      repo: name,
      owner: login,
      url: htmlUrl
    }
  })
  return convertedIssues
}

export class IssueModel {
  static async convertAll () {
    const githubIssues = await getAuthenticatedUserIssues()
    const issues = convertIssues(githubIssues)

    const databaseId = getDatabaseId()

    for (const issue of issues) {
      const { title, id, owner, repo } = issue
      const isUnique = await isPageUnique({
        databaseId,
        name: title
      })

      if (isUnique) {
        await addPageToDatabase({
          databaseId,
          item: issue
        })

        await closeIssue({ id, owner, repo })
      }
    }
  }
}
