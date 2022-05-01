import { firestore } from 'firebase-functions'
import { firestore as fa } from 'firebase-admin'

export const autoDeleteUser = firestore
  .document('users/{uid}')
  .onWrite((change, context) => {
    console.log(change)
    console.log(context)
    console.log('got here')
    context.params.smash = 'Hello'
     fa().collection('shared').doc('logs').set({ what: 'is up' })
  })
