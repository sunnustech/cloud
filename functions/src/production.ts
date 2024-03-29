import { logger, https } from 'firebase-functions'
import { AuthData } from 'firebase-functions/lib/common/providers/https'
import { handleMatch } from './tss'
import { QRApi } from './production/qr'

export { handleMatch, QRApi }

/**
 * Exports onCall functions to be used in the frontend
 * refer to 'functions/src/index.ts' for explanation
 */

export const authTest = https.onCall((data, context) => {
  logger.info('authentication testing 3')

  if (!context.auth) {
    throw new https.HttpsError('unauthenticated', 'Please log in first')
  }

  /* use this section to check for user type (participant/facil/admin)
   * use email as identifier and lookup in database for roles
   */
  const auth: AuthData | undefined = context.auth
  const email = auth.token.email

  return {
    email,
    originalData: data,
    hello: 'world',
  }
})
