import { firestore as fs } from 'firebase-functions'
import { firestore } from 'firebase-admin'

export const autoLinkChangedUser = fs
  .document('users/{uid}')
  .onUpdate(async (change, context) => {
    const teamsCollection = firestore().collection('teams')
    // add to new team
    const after = change.after.data()?.teamName
    if (after) {
      const afterTeam = teamsCollection.doc(after)
      // check if after team exists
      const doc = await afterTeam.get()
      if (!doc.exists) {
        firestore()
          .collection('users')
          .doc(context.params.uid)
          .update(change.before.data())
        return null
      }
      afterTeam.update({
        members: firestore.FieldValue.arrayUnion(context.params.uid),
      })
    }
    // remove from old team, but only if new team exists
    const before = change.before.data()?.teamName
    if (before) {
      const beforeTeam = teamsCollection.doc(before)
      const doc = await beforeTeam.get()
      if (!doc.exists) {
        return false
      }
      beforeTeam.update({
        members: firestore.FieldValue.arrayRemove(context.params.uid),
      })
    }
    return null
  })
