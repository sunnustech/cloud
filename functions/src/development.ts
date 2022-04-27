import { firestore } from 'firebase-admin'
import { https } from 'firebase-functions'

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
  console.debug('hello, server!')
  res.json({
    message: 'hello, requester!',
    serverReceived: req.body,
  })
})

/* sunnus functions */
import { handleMatch } from './roundRobin'
import { writeSchema } from './data/writeSchema'
import { createTeams } from './teams/createTeams'
import { assignTSSTeams } from './teams/assignTSSTeams'
import { createUsers } from './users/createUsers'
import { assignUsers } from './users/assignUsers'
import { deleteAllUsers } from './users/deleteAllUsers'
import { createSchedule } from './schedule/createSchedule'
import { getSchedule } from './schedule/getSchedule'
import { deleteDocs } from './deletions/deleteDocs'
import { clearCollection } from './deletions/clearCollection'

export {
  deleteDocs,
  createTeams,
  assignTSSTeams,
  handleMatch,
  writeSchema,
  deleteAllUsers,
  createUsers,
  assignUsers,
  createSchedule,
  clearCollection,
  getSchedule,
}
