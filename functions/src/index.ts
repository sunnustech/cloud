import { logger, https } from 'firebase-functions'
import { initializeApp } from 'firebase-admin/app'
import { firestore } from 'firebase-admin'
import { AuthData } from 'firebase-functions/lib/common/providers/https'
import { handleMatch } from './handleMatch'
import { writeSchema } from './data/writeSchema'
import { createUsers, deleteAllUsers } from './users'
import { User } from './types/users'

initializeApp()

export { handleMatch, writeSchema, createUsers, deleteAllUsers }

export const addUserToTeam = https.onRequest(async (req, res) => {
  const user = req.body.user
  const teamName = req.body.teamName

  const existingTeamNames: string[] = (
    await firestore().collection('teams').listDocuments()
  ).map((e) => e.id)

  if (!existingTeamNames.includes(teamName)) {
    res.json({message: `Team ${teamName} does not exist. Please initialize it first.`})
    return
  }

  const docRef = firestore().collection('teams').doc(teamName)
  const data: User[] = (await docRef.get()).data()?.members

  if (!data) {
    res.json({message: `Internal server error: ${teamName} member array has an issue`})
    return
  }

  const existingUIDs = data.map(e => e.uid)

  if (!existingUIDs.includes(user.uid)) {
    res.json({message: `User ${user.email} is already in team ${teamName}.`})
    return
  }

  const writeResult = await docRef.set({
    members: firestore.FieldValue.arrayUnion({
      email: user.email,
      loginId: 'something unique',
      phoneNumber: user.phoneNumber,
      uid: user.uid,
    })
  },{merge: true})
  res.json({message: writeResult})
})

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
