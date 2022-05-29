/* sunnus functions */
import { initializeCollections } from './data/initializeCollections'
import { QRApi } from './qr'
import { handleMatch } from './tss'
import { updateSchedule } from './tss/updateSchedule'
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
import { createQR } from './qr/createQR'

export {
  autoLinkChangedUser,
  getUsers,
  pageAccess,
  updatePageAccess,
  updatePoints,
  getQuarterfinalists,
  deleteDocs,
  createTeams,
  createQR,
  // assignTSSTeams,
  handleMatch,
  updateSchedule,
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
