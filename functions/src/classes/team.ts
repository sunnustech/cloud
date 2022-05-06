import { sportList } from '../data/constants'
import {
  FirestoreDataConverter,
  QueryDocumentSnapshot,
  DocumentData,
} from '@google-cloud/firestore'
import { Sport } from '../types'
import { Init } from '../types/classes'
import { notEmpty } from '../utils/string'
import { fs } from '../init'

type SportFlexible = Sport | 'none' | 'more than 1'

const toFirestore = (team: Team) => ({
  members: team.members,
  teamName: team.teamName,
  direction: team.direction,
  sport: team.sport,
})

const fromFirestore = (snapshot: QueryDocumentSnapshot<DocumentData>) => {
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
}

export class Team {
  members: string[]
  teamName: string
  direction: string
  sport: SportFlexible
  static collectionRef = fs.collection('teams')
  static empty = new Team({
    teamName: '',
    direction: 'A',
    captainsBall: '',
    dodgeball: '',
    frisbee: '',
    tchoukball: '',
    touchRugby: '',
    volleyball: '',
  })
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
  /** converts a Team to a database-friendly object */
  static converter: FirestoreDataConverter<Team> = {
    toFirestore: (team: Team) => toFirestore(team),
    fromFirestore: (snapshot) => fromFirestore(snapshot),
  }
  /**
   * gets a team object from the database
   * @param {string} teamName
   * @returns {Promise<Team>}
   */
  static async get(teamName: string): Promise<Team> {
    const docRef = this.collectionRef
      .doc(teamName)
      .withConverter(this.converter)
    const snapshot = await docRef.get()
    const data = snapshot.data()
    if (data) {
      return data
    }
    return Team.empty
  }
  /**
   * add/updates the database with the team
   * @param {Team} team
   */
  static async set(team: Team) {
    const docRef = this.collectionRef
      .doc(team.teamName)
      .withConverter(this.converter)
    await docRef.set(team, { merge: true })
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
