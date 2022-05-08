import { FirestoreDataConverter, DocumentData } from '@google-cloud/firestore'
import { Team } from './team'
import { User } from './user'
import { fs } from '../init'

export namespace converter {
  export const user: FirestoreDataConverter<User> = {
    toFirestore: (user: User) => {
      return {
        email: user.email,
        phoneNumber: user.phoneNumber,
        realEmail: user.realEmail,
        role: user.role,
        teamName: user.teamName,
        loginId: user.loginId,
        uid: user.uid,
      }
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data()
      const user = new User({
        phoneNumber: data.phoneNumber,
        role: data.role,
        email: data.email,
        teamName: data.teamName,
      })
      user.setUid(data.uid)
      user.setLoginId(data.loginId)
      return user
    },
  }
  export const team: FirestoreDataConverter<Team> = {
    toFirestore: (team: Team) => {
      const data: DocumentData = {}
      rebuild.team(team, data)
      return data
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data()
      const team = new Team({
        teamName: data.teamName,
        direction: data.direction,
        captainsBall: '',
        dodgeball: '',
        frisbee: '',
        tchoukball: '',
        touchRugby: '',
        volleyball: '',
      })
      rebuild.team(data, team)
      return team
    },
  }
}

export namespace collection {
  export const users = fs.collection('users').withConverter(converter.user)
  export const teams = fs.collection('teams').withConverter(converter.team)
}

/**
 * using source, rebuild target
 */
export namespace rebuild {
  export const team = (source: Team | DocumentData, target: Team | DocumentData) => {
    target.teamName = source.teamName || ''
    target.members = source.members || []
    target.sport = source.sport || ''
    target.direction = source.direction || ''
    target._started = source._started || false
    target._stopped = source._stopped || false
    target._startTime = source._startTime || 0
    target._stopTime = source._stopTime || 0
    target._timerRunning = source._timerRunning || false
    target._allEvents = source._allEvents || []
    target._points = source._points || 0
    target._timerEvents = source._timerEvents || []
    target._start = source._start || 0
    target._pausedAt = source._pausedAt || 0
    target._stationsCompleted = source._stationsCompleted || []
    target._stationsRemaining = source._stationsRemaining || []
  }
}
