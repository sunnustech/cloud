import { InitializeFirebaseUser, InitializeUser } from '../types/sunnus-init'

/**
 * takes a InitializeUser and adds basic information
 * for firebase to be able to create a full user
 * @param {InitializeUser} user: requested props
 * @param {string} loginIdNumber
 * @return {InitializeFirebaseUser}
 */
export function makeFirebaseUser(
  user: InitializeUser,
  loginIdNumber: string
): InitializeFirebaseUser {
  const loginId = `${user.teamName}${loginIdNumber}`
  const email = `${loginId}@sunnus.com`
  return {
    email,
    emailVerified: false,
    password: 'sunnus',
    disabled: false,
  }
}
