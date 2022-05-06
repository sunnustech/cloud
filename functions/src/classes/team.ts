import { sportList } from '../data/constants'
import { FirestoreDataConverter } from '@google-cloud/firestore'
import { Sport, Init, Team } from 'types'
import { notEmpty } from '../utils/string'

type SportFlexible = Sport | 'none' | 'more than 1'

export class BaseTeam implements Team {
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
  static converter: FirestoreDataConverter<BaseTeam> = {
    toFirestore: (team: BaseTeam) => {
      return {
        members: team.members,
        teamName: team.teamName,
        direction: team.direction,
        sport: team.sport,
      }
    },
    fromFirestore: (snapshot) => {
      const data = snapshot.data()
      const team = new BaseTeam({
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
    this.sport = BaseTeam.getSport(props)
    this.direction = props.direction
  }
  setSport(value: SportFlexible) {
    this.sport = value
  }
}
