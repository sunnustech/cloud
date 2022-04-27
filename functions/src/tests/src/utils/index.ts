export function removeSpaces(string: string): string {
  return string.replace(/ /g, '')
}

export function sanitizePhoneNumber(prefix: string, phone: string): string {
  const noSpaces = removeSpaces(phone)
  const re = new RegExp(`^\\+${prefix}`) 
  return noSpaces.replace(re, '')
}

export function isEmpty(string: string): boolean {
  return string !== ''
}
