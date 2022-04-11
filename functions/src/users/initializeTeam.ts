import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'

const SOARInit = {
  timerRunning: false,
  started: false,
  stopped: false,
  startTime: 0,
  stopTime: 0,
  allEvents: [],
  direction: 'A',
  points: 0,
}

export const initializeTeam = async (teamName: string): Promise<WriteResult> => {
  const teamData = {
    SOAR: SOARInit,
    SOARStart: 0,
    SOARTimerEvents: [0],
    SOARPausedAt: 0,
    SOARStationsCompleted: [],
    teamName,
    SOARStationsRemaining: [],
    members: [],
    registeredEvents: {},
  }
  const result = await firestore()
  .collection('teams')
  .doc(teamName)
  .set(teamData)

  return result
}
