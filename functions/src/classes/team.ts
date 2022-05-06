import { sportList } from '../data/constants'
import { FirestoreDataConverter } from '@google-cloud/firestore'
import { Sport } from '../types/TSS'
import { Init } from '../types/classes'
import { notEmpty } from '../utils/string'

type SportFlexible = Sport | 'none' | 'more than 1'

export class Team {
  members: string[]
  teamName: string
  direction: string
  sport: SportFlexible
  private static getSport(props: Init.Team) {
    let result: SportFlexible = 'none'
    const sportsSignedUp = sportList
      .map((sport) => {
        const signedUp = notEmpty(props[sport])
        if (signedUp) {
          result = sport
        }
        return signedUp
      })
      .filter((s) => s === true).length

    if (sportsSignedUp > 1) {
      return 'more than 1'
    }
    return result
  }
  static converter: FirestoreDataConverter<Team> = {
    toFirestore: (team: Team) => {
      return {
        members: team.members,
        teamName: team.teamName,
        direction: team.direction,
        sport: team.sport,
      }
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
      team.setSport(data.sport)
      return team
    },
  }
  constructor(props: Init.Team) {
    this.teamName = props.teamName
    this.members = []
    this.sport = Team.getSport(props)
    this.direction = props.direction
  }
  setSport(value: SportFlexible) {
    this.sport = value
  }
}
