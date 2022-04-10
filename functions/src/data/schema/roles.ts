import { TypedRoles, BooleanDict } from '../../types/roles'

const admins: Array<string> = [
  'calista@gmail.com',
  'something@gmail.com',
  'is@gmail.com',
  'up@gmail.com',
]

const facilitators: Array<string> = [
  'hongsheng@gmail.com',
  'daddy@gmail.com',
  'supreme@gmail.com',
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
