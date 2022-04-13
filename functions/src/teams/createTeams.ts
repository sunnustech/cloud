import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
import { Team } from '../types/sunnus-firestore'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'

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
  const requestKeys = Object.keys(req.body)

  /* check to see if userList is a property of the request body */
  if (!requestKeys.includes('teamList')) {
    res.json({
      keys: requestKeys,
      message: 'please supply a list of users in the property "userList"',
      data: req.body,
    })
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
