type RequiredKey = {
  key: string
  description: string
}

function getKeyChecks(arr: RequiredKey[]): string[][] {
  return arr.map((item) => [
    item.key,
    `Please supply a ${item.key} in the \`${item.description}\` prop of the request body.`,
  ])
}

export const createSchedule = getKeyChecks([
  { key: 'scheduleConfig', description: 'schedule config' },
  { key: 'roundRobinConfig', description: 'round robin config' },
  { key: 'debugScores', description: 'boolean' },
])

export const getSchedule = getKeyChecks([
  { key: 'filter', description: 'filter' },
])

export const assignTSSTeams = getKeyChecks([
  { key: 'please', description: 'magic word' },
])

export const createTeams = getKeyChecks([
  { key: 'teamList', description: 'team data' },
])

export const getQuarterfinalists = getKeyChecks([
  { key: 'sportList', description: 'list of sports' },
])

export const updatePageAccess = getKeyChecks([
  { key: 'pages', description: 'page access state' },
])

export const createUsers = getKeyChecks([
  { key: 'userList', description: 'list of users' },
])
