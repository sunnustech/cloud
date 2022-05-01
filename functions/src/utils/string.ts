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

/**
 * does what it says
 * @param {string} string
 * @returns {string}
 */
export function removeSpaces(string: string): string {
  return string.replace(/ /g, '')
}

/**
 * cleans up a phone number
 * @param {string} phone
 * @returns {string} 8-digit, no spaces
 */
export function sanitizePhoneNumber(phone: string): string {
  if (phone === '') {
    return ''
  }
  const prefix = "65"
  const noSpaces = removeSpaces(phone)
  const re = new RegExp(`^\\+${prefix}`)
  return noSpaces.replace(re, '')
}
