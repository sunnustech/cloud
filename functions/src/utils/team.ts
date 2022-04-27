import { InitializeTeam } from '../types/sunnus-init'
import { Team } from '../types/sunnus-firestore'

/**
 * creates an object with team names as keys
 * and team props as values
 * @param {Array<T>} arr: the array of team props
 * @return {Record<string, T>} the final object
 */
export function makeTeams(arr: Array<Team>): Record<string, Team> {
  const obj: Record<string, Team> = {}
  arr.forEach((e: Team) => {
    obj[e.teamName] = e
  })
  return obj
}

/**
 * creates a firestore-ready team from request data
 * @param {InitializeTeam} props: the request data
 * @return {Team} a firestore-ready team object
 */
export function makeTeam(props: InitializeTeam): Team {
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

