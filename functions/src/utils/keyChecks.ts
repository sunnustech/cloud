export const createSchedule = [
  { key: 'scheduleConfig', description: 'schedule config' },
  { key: 'roundRobinConfig', description: 'round robin config' },
  { key: 'debugScores', description: 'boolean' },
]

export const getSchedule = [{ key: 'filter', description: 'filter' }]

export const assignTSSTeams = [{ key: 'please', description: 'magic word' }]

export const createTeams = [{ key: 'teamListCsvString', description: 'team data' }]

export const getQuarterfinalists = [
  { key: 'sportList', description: 'list of sports' },
]

export const updatePageAccess = [
  { key: 'pages', description: 'page access state' },
]

export const createUsers = [
  { key: 'userListCsvString', description: 'list of users' },
]

export const deleteDocs = [
  { key: 'collection', description: 'collection name' },
  { key: 'documents', description: 'list of documents' },
]

export const deleteAllUsers = [
  { key: 'whitelist', description: 'whitelist' },
]

export const please = [{ key: 'please', description: 'magic word' }]

export const clearCollection = [
  { key: 'collection', description: 'collection name' },
]
