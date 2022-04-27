import { https } from 'firebase-functions'
import { InitializeTeam } from '../types/sunnus-init'
import { firestore } from 'firebase-admin'
import { WriteResult } from '@google-cloud/firestore'
import { hasMissingKeys } from '../utils'
import { createTeams as keyCheck } from '../utils/keyChecks'
import { makeTeam } from '../utils/team'

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
