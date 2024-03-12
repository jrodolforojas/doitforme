export const getAuthenticatedUserIssues = async () => {
  const token = process.env.GITHUB_API_KEY ?? ''
  const response = await fetch('https://api.github.com/issues', {
    headers: {
      Authorization: `Bearer ${token}`,
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
  const token = process.env.GITHUB_API_KEY ?? ''
  const url = `${process.env.GITHUB_API_URL}/repos/${owner}/${repo}/issues/${id}`
  const response = await fetch(url, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
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
