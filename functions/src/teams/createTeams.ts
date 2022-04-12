import { https } from 'firebase-functions'
import { NewTeamProps, TeamProps } from '../types/participants'
import { listDocIdsAsync, partition } from '../utils'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'

function makeTeam(props: NewTeamProps): TeamProps {
  return {
    teamName: props.teamName,
    members: [],
    registeredEvents: props.registeredEvents,
    SOARStart: 0,
    SOARTimerEvents: [0],
    SOARPausedAt: 0,
    SOARStationsCompleted: [],
    SOARStationsRemaining: [],
    direction: props.direction,
    SOAR: {
      timerRunning: false,
      started: false,
      stopped: false,
      startTime: 0,
      stopTime: 0,
      allEvents: [],
      direction: 'A',
      points: 0,
    },
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

  const teamList: NewTeamProps[] = req.body.teamList
  const existingTeamNames: string[] = await listDocIdsAsync('teams')

  const [tobeFulfilled, alreadyExisting] = partition(teamList, (team) =>
    !existingTeamNames.includes(team.teamName)
  )

  const madeTeamList: TeamProps[] = tobeFulfilled.map((team) => makeTeam(team))

  const teamsCollection = firestore().collection('teams')
  const createTeamsQueue: Promise<WriteResult>[] = []

  madeTeamList.forEach(team => {
    createTeamsQueue.push(teamsCollection.doc(team.teamName).create(team))
  })

  const writeResult = await Promise.allSettled(createTeamsQueue)

  console.log(alreadyExisting)

  res.json({
    result: `Round robin handler at your service!`,
    // teamList,
    // alreadyExisting,
    // tobeFulfilled,
    madeTeamList,
    writeResult
  })
})
