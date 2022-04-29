import { https } from 'firebase-functions'
import { Event, RoundRobinConfig, ScheduleConfig } from '../types/schedule'
import { hasMissingKeys } from '../utils'
import { createSchedule as keyCheck } from '../utils/keyChecks'
import { makeSchedule } from './makeSchedule'
import { firestore } from 'firebase-admin'
import { DocumentData, DocumentReference } from '@google-cloud/firestore'
import { Sport } from '../types'

async function fetchTSSCache(): Promise<Record<Sport, Record<string, string>>> {
  const sharedCollection = firestore().collection('shared')
  const rawCache = (await sharedCollection.doc('tssCache').get()).data()
  const tssCache: Record<Sport, Record<string, string>> = {
    volleyball: rawCache?.volleyball || {},
    tchoukball: rawCache?.tchoukball || {},
    touchRugby: rawCache?.touchRugby || {},
    frisbee: rawCache?.frisbee || {},
    dodgeball: rawCache?.dodgeball || {},
    captainsBall: rawCache?.captainsBall || {},
  }
  return tssCache
}

export const createSchedule = https.onRequest(async (req, res) => {
  if (hasMissingKeys(keyCheck, req, res)) return

  const debugScores = req.body.debugScores
  const sc: ScheduleConfig = req.body.scheduleConfig
  const rr: RoundRobinConfig = req.body.roundRobinConfig

  // fetch existing cache that matches letter-number (A1) id to team name
  const tssCache: Record<Sport, Record<string, string>> = await fetchTSSCache()

  // build the schedule
  const schedule: Event[] = makeSchedule(sc, rr, tssCache, debugScores)

  // write the schedule to firebase
  const scheduleCollection = firestore().collection('schedule')
  const makeEventQueue: Promise<DocumentReference<DocumentData>>[] = []
  schedule.forEach((event) => {
    makeEventQueue.push(scheduleCollection.add(event))
  })
  const writeResult = await Promise.allSettled(makeEventQueue)

  /* send back the statuses */
  res.json({
    writeResult,
  })
})
