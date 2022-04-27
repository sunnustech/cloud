import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
import { Team } from '../types/sunnus-firestore'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { hasMissingKeys } from '../utils'
import { createTeams as keyCheck } from '../utils/keyChecks'

/**
 * creates a firestore-ready team from request data
 * @param {InitializeTeam} props: the request data
 * @return {Team} a firestore-ready team object
 */
function makeTeam(props: InitializeTeam): Team {
  return {
    teamName: props.teamName,
    registeredEvents: props.registeredEvents,
    direction: props.direction,
    SOAR: {
      direction: props.direction,
      allEvents: [],
      points: 0,
      startTime: 0,
      started: false,
      stopTime: 0,
      stopped: false,
      timerRunning: false,
    },
    SOARPausedAt: 0,
    SOARStart: 0,
    SOARStationsCompleted: [],
    SOARStationsRemaining: [],
    SOARTimerEvents: [0],
    members: [],
  }
}

export const createTeams = https.onRequest(async (req, res) => {
  const [err, status] = hasMissingKeys(keyCheck, req)
  if (status === 'missing') {
    res.json({ message: err })
    return
  }

  const teamList: InitializeTeam[] = req.body.teamList

  const teamsCollection = firestore().collection('teams')
  const createTeamsQueue: Promise<WriteResult>[] = []

  teamList.forEach((team) => {
    createTeamsQueue.push(
        teamsCollection.doc(team.teamName).create(makeTeam(team))
    )
  })

  const writeResult = await Promise.allSettled(createTeamsQueue)

  res.json({
    result: 'Round robin handler at your service!',
    writeResult,
  })
})
