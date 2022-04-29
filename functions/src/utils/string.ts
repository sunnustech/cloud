/**
 * @param {string} string: the string you want to process
 * @return {string} the joined string with each first letter capitalized
 */
export function capitalizeFirstLettersAndJoin(string: string): string {
  const separateWord = string.split(' ')
  for (let i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
  }
  return separateWord.join('')
}

