import { Firestore, Team } from '../../types/sunnus-firestore'
import { SOARTeamProps } from '../../types/SOAR'
import { InitializeTeam } from '../../types/sunnus-init'
import { makeTeams } from '../../utils/team'
import { stationOrder } from './SOAR'

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

/**
 * @param {InitializeTeam} props: basic details of a fresh team
 * @return {Team} a firestore-ready team object with empty props
 */
export function newSunNUSTeam(props: InitializeTeam): Team {
  return {
    SOAR: SOARInit,
    SOARStart: 0,
    SOARTimerEvents: [0],
    SOARPausedAt: 0,
    SOARStationsCompleted: [],

    direction: props.direction,
    teamName: props.teamName,
    SOARStationsRemaining: stationOrder[props.direction],
    members: [],
    registeredEvents: props.registeredEvents,
  }
}

const testOne = newSunNUSTeam({
  teamName: 'Known_Painters',
  registeredEvents: {
    TSS: {
      volleyball: true,
      captainsBall: false,
      dodgeball: false,
      frisbee: false,
      tchoukball: false,
      touchRugby: false,
    },
    SOAR: true,
  },
  direction: 'A',
})

const testTwo = newSunNUSTeam({
  teamName: 'Modest_Liberators',
  registeredEvents: {
    TSS: {
      volleyball: true,
      frisbee: false,
      captainsBall: false,
      dodgeball: false,
      tchoukball: false,
      touchRugby: false,
    },
    SOAR: true,
  },
  direction: 'A',
})

const testThree = newSunNUSTeam({
  teamName: 'HS123',
  registeredEvents: {
    TSS: {
      volleyball: false,
      frisbee: false,
      captainsBall: false,
      dodgeball: false,
      tchoukball: false,
      touchRugby: false,
    },
    SOAR: true,
  },
  direction: 'A',
})

const Developer = newSunNUSTeam({
  teamName: 'Developer',
  direction: 'A',
  registeredEvents: {
    SOAR: true,
  },
})

const trimTeamNameToLowercase = (teamName: string) => {
  return teamName.split('_').join('').split(' ').join('').toLowerCase()
}

const generateRandomID = () => {
  return Math.random().toString(10).substring(2, 5)
}

const addLoginId = (obj: Team): Team => {
  const teamName = trimTeamNameToLowercase(obj.teamName)
  obj.members.forEach((e: any) => {
    e['loginId'] = teamName + generateRandomID()
  })
  return obj
}

const allTeams: Array<Team> = [
  addLoginId(testOne),
  addLoginId(testTwo),
  addLoginId(testThree),
  Developer,
]

const teams: Firestore['teams'] = makeTeams(allTeams)

export default teams
export { SOARInit }
