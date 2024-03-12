import { Client } from '@notionhq/client'

const createClient = () => {
  const token = process.env.NOTION_API_KEY ?? ''
  return new Client({ auth: token })
}

export const getDatabaseItems = async ({ databaseId }) => {
  const notion = createClient()
  const response = await notion.databases.query({
    database_id: databaseId
  })

  return response
}

export const getPage = async ({ pageId }) => {
  const notion = createClient()
  const response = await notion.pages.retrieve({
    page_id: pageId
  })

  return response
}

export const isPageUnique = async ({ databaseId, name }) => {
  const notion = createClient()
  const sameItemsDatabase = await notion.databases.query({
    database_id: databaseId,
    filter: {
      property: 'Name',
      title: {
        equals: name
      }
    }
  })

  return sameItemsDatabase.results.length === 0
}

export const addPageToDatabase = async ({ databaseId, item }) => {
  const notion = createClient()
  const response = await notion.pages.create({
    parent: {
      type: 'database_id',
      database_id: databaseId
    },
    properties: {
      'GitHub Pull Requests': { id: '%3CDkL', type: 'relation', relation: [], has_more: false },
      Sprint: item.sprint,
      Due: { id: 'MIR_', type: 'date', date: null },
      Tipo: item.type,
      Plataforma: {
        id: 'T%5CXQ',
        type: 'multi_select',
        multi_select: [
          { id: 'LCX=', name: 'Servidor', color: 'green' },
          { id: 'lsb<', name: 'UI', color: 'red' }
        ]
      },
      Status: {
        id: 'pEnz',
        type: 'status',
        status: {
          id: '97a78182-72cf-4b20-94b5-3ccb5e9e7e73',
          name: 'Not started',
          color: 'default'
        }
      },
      Prioridad: item.priority,
      Name: {
        id: 'title',
        type: 'title',
        title: [
          {
            type: 'text',
            text: { content: item.title, link: null },
            annotations: {
              bold: false,
              italic: false,
              strikethrough: false,
              underline: false,
              code: false,
              color: 'default'
            },
            plain_text: item.title,
            href: null
          }
        ]
      }
    },
    children: [
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content: item.body
              }
            }
          ]
        }
      },
      {
        paragraph: {
          rich_text: [
            {
              text: {
                content: item.url
              }
            }
          ]
        }
      }
    ]
  })

  return response
}
