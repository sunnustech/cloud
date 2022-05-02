import { firestore as fs } from 'firebase-functions'
import { firestore } from 'firebase-admin'

export const autoLinkNewUser = fs
  .document('users/{uid}')
  .onWrite((change, context) => {
    const after = change.after.data()
    if (!after) {
      return
    }
    const teamName = after.smashed
    if (!teamName) {
      return
    }
    const teamsCollection = firestore().collection('teams')
    const teamDoc = teamsCollection.doc(teamName)
    teamDoc.update({
      members: firestore.FieldValue.arrayUnion(context.params.uid),
    })
  })
