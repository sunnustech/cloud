import { logger, https } from 'firebase-functions'

export const handleMatch = https.onRequest((req, res) =>  {
  logger.log('got here')
})
