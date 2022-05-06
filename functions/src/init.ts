import { firestore } from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'
initializeApp()

const fs = firestore()

export { fs }
