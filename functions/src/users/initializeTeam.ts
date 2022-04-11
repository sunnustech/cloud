import { https } from 'firebase-functions'
import { firestore } from 'firebase-admin'
import { getAuth, UserRecord } from 'firebase-admin/auth'

const SOARInit: SOARTeamProps = {
  timerRunning: false,
  started: false,
  stopped: false,
  startTime: 0,
  stopTime: 0,
  allEvents: [],
  direction: 'A',
  points: 0,
}

export const initializeSunNUSTeam = https.onRequest(async (req, res) => {
  const teamName = 'basic test'
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
})
