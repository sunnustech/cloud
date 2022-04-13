console.log('hi')

function getLoginId() {
  const [min, max] = [0, 100]
  const random = Math.random() * (max - min)
  const integer = Math.floor(random) + min + max
  return integer.toString().substring(1)
}

function getLoginIdList(n: number, existingIds: string[]): string[] {
  const existingIdDict: Record<string, boolean> = {}
  existingIds.forEach(id => {
    existingIdDict[id] = true
  })
  const fresh: string[] = []
  let i = 0
  while (i < n) {
    const id = getLoginId()
    if (existingIdDict[id] === true) {
      continue
    }
    fresh.push(id)
    existingIdDict[id] = true
    i++
  }
  return fresh
}

const foo = getLoginIdList(10, [
  '10',
  '20',
  '30',
  '40',
  '50',
  '60',
  '70',
  '80',
  '90',
  '100',
])

console.log(foo)
