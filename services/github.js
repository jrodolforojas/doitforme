class GithubClient {
  // eslint-disable-next-line space-before-function-paren
  constructor() {
    this.token = process.env.GITHUB_API_KEY ?? ''
    this.url = process.env.GITHUB_API_URL ?? ''
  }
}

export const getAuthenticatedUserIssues = async () => {
  const github = new GithubClient()
  const response = await fetch(`${github.url}/issues`, {
    headers: {
      Authorization: `Bearer ${github.token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    }
  })
  if (!response.ok) {
    console.error('Failed to fetch issues')
    return []
  }
  const data = await response.json()

  return data
}

export const closeIssue = async ({ id, owner, repo }) => {
  const github = new GithubClient()
  const url = `${github.url}/repos/${owner}/${repo}/issues/${id}`
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${github.token}`,
      'X-GitHub-Api-Version': '2022-11-28'
    },
    body: JSON.stringify({
      state: 'closed'
    })
  })

  if (!response.ok) {
    console.error({ msg: 'Failed to close the issue', id, owner, repo, url })
    return
  }

  const data = await response.json()

  return data
}
