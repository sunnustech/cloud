import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'

import typedParticipants from './schema/participants'
import typedTSS from './schema/TSS'
import typedSOAR from './schema/SOAR'
import typedRoles from './schema/roles'

function getCollectionRef(collection: string) {
  const ref = firestore().collection(collection)
  return ref
}

const writeSchema = async () => {
  push({ collection: 'participants', docs: typedParticipants })
  push({ collection: 'SOAR', docs: typedSOAR })
  push({ collection: 'TSS', docs: typedTSS })
  push({ collection: 'roles', docs: typedRoles })
}

export default writeSchema
