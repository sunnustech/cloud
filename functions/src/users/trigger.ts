import { firestore as fs } from 'firebase-functions'
import { firestore } from 'firebase-admin'

export const autoLinkNewUser = fs
  .document('users/{uid}')
  .onCreate((snap, context) => {
    const data = snap.data()
    if (!data) {
      return false
    }
    const teamName = data.teamName
    if (!teamName) {
      return false
    }
    const teamsCollection = firestore().collection('teams')
    const teamDoc = teamsCollection.doc(teamName)
    teamDoc.update({
      members: firestore.FieldValue.arrayUnion(context.params.uid),
    })
    return true
  })

export const autoLinkChangedUser = fs
  .document('users/{uid}')
  .onUpdate((change, context) => {
    const data = change.after.data()
    if (!data) {
      return null
    }
    const teamName = data.teamName
    if (!teamName) {
      return null
    }
    const teamsCollection = firestore().collection('teams')
    const teamDoc = teamsCollection.doc(teamName)
    teamDoc.update({
      members: firestore.FieldValue.arrayUnion(context.params.uid),
    })
    return null
  })
