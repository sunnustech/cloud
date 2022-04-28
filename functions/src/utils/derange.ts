function getRandomIntBetween(min: number, max: number) {
  return Math.trunc(Math.random() * (max - min) + min)
}

function shuffle(array: number[]) {
  const a = [...array]
  const length = a.length

  for (let i = 0; i < length; i++) {
    const pos = getRandomIntBetween(0, length)
    const aux = a[i]
    a[i] = a[pos]
    a[pos] = aux
  }

  return a
}

function fill(length: number) {
  const array = []

  for (let i = 0; i < length; i++) {
    array[i] = i
  }

  return array
}

function displace(array: number[], by: number) {
  const length = array.length
  const a: number[] = []
  array.forEach((i) => {
    a[i] = array[(i + by) % length]
  })

  return a
}

function checkArg<T>(array: T[]) {
  if (!Array.isArray(array)) {
    throw new Error('Argument of "derange" function must be of type Array!')
  }

  if (array.length < 2) {
    throw new Error('Sets with les than two items have cannot be deranged!')
  }
}

export function derange<T>(array: T[]) {
  checkArg(array)
  const length = array.length

  if (!length || length === 1) {
    return []
  }
  const indices = shuffle(fill(length))
  const displaced = displace(indices, 1)
  const derangedArray: T[] = []
  for (let i = 0; i < length; i++) {
    derangedArray[indices[i]] = array[displaced[i]]
  }

  return derangedArray
}
