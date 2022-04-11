import { TypedRoles, BooleanDict } from '../../types/roles'

const admins: Array<string> = [
  'hgOiKxBqMPgop95eESIZnADpwyK2', // brew4k@gmail.com
  'TJFUjBCGF8XSziA6QCbBL0pZNx33', // hongsheng@gmail.com
  '8uRI4WLMTZX7RlU8YuFDlH7mgL12', // calista@gmail.com
]

const facilitators: Array<string> = [
  'hgOiKxBqMPgop95eESIZnADpwyK2', // brew4k@gmail.com
  'TJFUjBCGF8XSziA6QCbBL0pZNx33', // hongsheng@gmail.com
  '8uRI4WLMTZX7RlU8YuFDlH7mgL12', // calista@gmail.com
  '3uorVJy2cvRDLE4xJgh4t5dOL4k1', // sunnus@gmail.com
]

/**
 * from an array generate an object whose keys are
 * the elements of the array and values are all true
 * @param {Array<string>} arr: the array
 * @return {BooleanDict} the dictionary of trues
 */
function generateKeys(arr: Array<string>): BooleanDict {
  const result: BooleanDict = {}
  arr.forEach((email) => {
    result[email] = true
  })
  return result
}

const typedRoles: TypedRoles = {
  admins: generateKeys(admins),
  facilitators: generateKeys(facilitators),
}

export default typedRoles
