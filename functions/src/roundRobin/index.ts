import { https } from 'firebase-functions'

export const handleMatch = https.onCall(async (req, context) => {
  return {
    result: `Round robin handler at your service!`,
  }
})
