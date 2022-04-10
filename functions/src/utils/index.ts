import { TeamProps } from '../types/participants'

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
 * creates an object with team names as keys
 * and team props as values
 * @param {Array<T>} arr: the array of team props
 * @return {Record<string, T>} the final object
 */
export function makeTeams(
    arr: Array<TeamProps>,
): Record<string, TeamProps> {
  const obj: Record<string, TeamProps> = {}
  arr.forEach((e: TeamProps) => {
    obj[e.teamName] = e
  })
  return obj
}
