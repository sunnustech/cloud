import { firestore } from 'firebase-functions'
import { firestore as fa } from 'firebase-admin'

export const autoDeleteUser = firestore
  .document('users/{uid}')
  .onWrite((change, context) => {
    console.log(context.params.uid)
    console.log(Object.keys(change))
    context.params.smash = 'Hello'
     fa().collection('shared').doc('logs').set({ lastChange: context.params.uid })
  })
