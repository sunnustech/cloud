import { https } from 'firebase-functions'
import CryptoJS from 'crypto-js'

export const createQR = https.onRequest(async (req, res) => {
  const body = req.body
  const event = body.event
  const action = body.action
  const facilitator = body.facilitator
  const score = body.score

  console.log(body)
  console.log(event)
  console.log(action)
  console.log(facilitator)
  console.log(score)

  if (!event || !action || !facilitator || !score) {
    console.log('Bad request body.')
    return
  }

  const SALT = 'MoonNUS'
  const SEPERATOR = '_'
  const str =
    event +
    SEPERATOR +
    action +
    SEPERATOR +
    score.toString() +
    SEPERATOR +
    facilitator
  const cipherText = CryptoJS.AES.encrypt(str, SALT).toString()

  const tempResult = await Promise.resolve(str)
  const writeResult = await Promise.resolve(cipherText)

  /* send back the statuses */
  res.json({
    tempResult,
    writeResult,
  })
})
