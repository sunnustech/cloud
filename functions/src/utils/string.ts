/**
 * Capitalizes the first letter of each word and combines them afterwards
 *
 * @param {string} string the string you want to process
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
 * Removes spaces from a string
 *
 * @param {string} string the string you want to process
 * @return {string} returns a string with spaces trimmed
 */
export function removeSpaces(string: string): string {
  return string.replace(/ /g, '')
}

/**
 * Cleans up a phone number by removing spaces and country code
 *
 * @param {string} phone
 * @return {string} 8-digit, no spaces
 */
export function sanitizePhoneNumber(phone: string): string {
  if (phone === '') {
    return ''
  }
  const prefix = '65'
  const noSpaces = removeSpaces(phone)
  const re = new RegExp(`^\\+${prefix}`)
  return noSpaces.replace(re, '')
}

/**
 * Checks if a given string is empty
 *
 * @param {string} string the string you want to process
 * @return {boolean} whether or not string is empty
 */
export function isEmpty(string: string): boolean {
  return string === ''
}

/**
 * Checks if a given string is not empty
 *
 * @param {string} string the string you want to process
 * @return {boolean} whether or not string is not empty
 */
export function notEmpty(string: string): boolean {
  return string !== ''
}
