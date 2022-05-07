import { https } from 'firebase-functions'

export const helloWorld = https.onRequest(async (req, res) => {
  console.debug('hello, server!')
  res.json({
    message: 'hello, requester!',
    serverReceived: req.body,
  })
})

/* sunnus functions */
import { initializeCollections } from './data/initializeCollections'
import { QRApi } from './qr'
import { handleMatch } from './roundRobin'
import { writeSchema } from './data/writeSchema'
import { createTeams } from './teams/createTeams'
// import { assignTSSTeams } from './teams/assignTSSTeams'
import { createUsers } from './users/createUsers'
import { autoLinkChangedUser } from './users/trigger'
import { getUsers } from './users/getUsers'
import { assignUsers } from './users/assignUsers'
import { deleteAllUsers } from './users/deleteAllUsers'
import { createSchedule } from './schedule/createSchedule'
import { getSchedule } from './schedule/getSchedule'
import { deleteDocs } from './deletions/deleteDocs'
import { clearCollection } from './deletions/clearCollection'
import { updatePoints } from './tss/updatePoints'
import { getQuarterfinalists } from './tss/getQuarterfinalists'
import { pageAccess } from './access/pageAccess'
import { updatePageAccess } from './access/updatePageAccess'

export {
  autoLinkChangedUser,
  getUsers,
  pageAccess,
  updatePageAccess,
  updatePoints,
  getQuarterfinalists,
  deleteDocs,
  createTeams,
  // assignTSSTeams,
  handleMatch,
  writeSchema,
  deleteAllUsers,
  createUsers,
  assignUsers,
  createSchedule,
  clearCollection,
  getSchedule,
  initializeCollections,
  QRApi,
}
