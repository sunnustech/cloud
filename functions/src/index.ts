import { logger, https } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { firestore } from 'firebase-admin'
import { AuthData } from 'firebase-functions/lib/common/providers/https'
// import { handleMatch } from './knockout'
import { handleMatch } from './roundRobin'
import { writeSchema } from './data/writeSchema'
import { createUsersAndAddToTeams, deleteAllUsers, createUsers } from './users'
import { createTeams } from './teams'

initializeApp()

export {
  createTeams,
  handleMatch,
  writeSchema,
  createUsersAndAddToTeams,
  deleteAllUsers,
  createUsers,
}

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

export const addMessage = https.onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await firestore()
      .collection('cloud-functions')
      .add({ original: original })
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` })
})

export const helloWorld = https.onRequest(async (req, res) => {
  console.log('hello, server!')
  res.json({
    message: 'hello, requester!',
    serverReceived: req.body,
  })
})
