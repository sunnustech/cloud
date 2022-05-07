import { firestore } from 'firebase-admin'
import { initializeApp } from 'firebase-admin/app'

const app = initializeApp()
const fs = firestore()

export { app, fs }
