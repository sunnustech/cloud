export function capitalizeFirstLettersAndJoin(string: string) {
  var separateWord = string.split(' ')
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
  }
  return separateWord.join('')
}

export function objFromArray(
  arr: Array<{ [key: string]: any }>,
  identifierKey: string
) {
  const obj: any = {}
  arr.forEach((e) => {
    obj[e[identifierKey]] = e
  })
  return obj
}
