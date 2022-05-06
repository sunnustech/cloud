import { firestore as fs } from 'firebase-functions'
import { firestore } from 'firebase-admin'

export const autoLinkNewTeam = fs
  .document('teams/{teamName}')
  .onCreate((snap) => {
    const data = snap.data()
    if (!data) {
      return false
    }
    const teamName = data.teamName
    if (!teamName) {
      return false
    }
    const members: string[] = data.members
    if (!members || members.length === 0) {
      return false
    }
    const userCollection = firestore().collection('users')
    members.forEach(uid => {
      userCollection.doc(uid).update({ teamName })
    })
    return true
  })
