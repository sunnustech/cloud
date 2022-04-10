import {
  EmailProps,
  LoginIdProps,
  newTeamProps,
  ParticipantsDatabase,
  TeamProps,
  TeamsDatabase,
} from '../../types/participants'
import { SOARTeamProps } from '../../types/SOAR'
import { makeTeams } from '../../utils'
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
 * @param {newTeamProps} props: basic details of a fresh team
 * @return {TeamProps} a team object with empty props
 */
export function newSunNUSTeam(props: newTeamProps): TeamProps {
  return {
    SOAR: SOARInit,
    SOARStart: 0,
    SOARTimerEvents: [0],
    SOARPausedAt: 0,
    SOARStationsCompleted: [],

    direction: props.direction,
    teamName: props.teamName,
    SOARStationsRemaining: stationOrder[props.direction],
    members: props.members,
    registeredEvents: props.registeredEvents,
  }
}

const testOne = newSunNUSTeam({
  teamName: 'Known_Painters',
  registeredEvents: {
    TSS: {
      volleyball: true,
      dodgeball: true,
    },
    SOAR: true,
  },
  direction: 'A',
  members: [
    {
      loginId: '',
      email: 'alice@gmail.com',
      phone: '77884793',
    },
    {
      loginId: '',
      email: 'brandon@gmail.com',
      phone: '79412799',
    },
    {
      loginId: '',
      email: 'carla@gmail.com',
      phone: '77008669',
    },
    {
      loginId: '',
      email: 'dave@gmail.com',
      phone: '70620715',
    },
  ],
})

const testTwo = newSunNUSTeam({
  teamName: 'Modest_Liberators',
  registeredEvents: {
    TSS: {
      volleyball: true,
      frisbee: true,
    },
    SOAR: true,
  },
  direction: 'A',
  members: [
    {
      loginId: '',
      email: 'adam@gmail.com',
      phone: '73125593',
    },
    {
      loginId: '',
      email: 'beverly@gmail.com',
      phone: '75687708',
    },
    {
      loginId: '',
      email: 'cedric@gmail.com',
      phone: '75893845',
    },
    {
      loginId: '',
      email: 'dana@gmail.com',
      phone: '78449264',
    },
  ],
})

const testThree = newSunNUSTeam({
  teamName: 'HS123',
  registeredEvents: {
    TSS: {
      volleyball: true,
      dodgeball: true,
      frisbee: true,
    },
    SOAR: false,
  },
  direction: 'A',
  members: [
    {
      loginId: '',
      email: 'hongsheng@gmail.com',
      phone: '11111111',
    },
    {
      loginId: '',
      email: 'ryan@gmail.com',
      phone: '22222222',
    },
    {
      loginId: '',
      email: 'khang@gmail.com',
      phone: '88888888',
    },
    {
      loginId: '',
      email: 'junhong@gmail.com',
      phone: '99999999',
    },
  ],
})

const Developer = newSunNUSTeam({
  teamName: 'Developer',
  direction: 'A',
  registeredEvents: {
    SOAR: true,
  },
  members: [
    {
      email: 'adam@gmail.com',
      phone: '73125593',
      loginId: 'dev_loper120389',
    },
    {
      email: 'beverly@gmail.com',
      phone: '75687708',
      loginId: 'dev_loper120388',
    },
    {
      email: 'calista@gmail.com',
      phone: '75893845',
      loginId: 'k',
    },
    {
      email: 'dana@gmail.com',
      phone: '78449264',
      loginId: 'dev_loper120386',
    },
  ],
})

const trimTeamNameToLowercase = (teamName: string) => {
  return teamName.split('_').join('').split(' ').join('').toLowerCase()
}

const generateRandomID = () => {
  return Math.random().toString(10).substring(2, 5)
}

const addLoginId = (obj: TeamProps): TeamProps => {
  const teamName = trimTeamNameToLowercase(obj.teamName)
  obj.members.forEach((e: any) => {
    e['loginId'] = teamName + generateRandomID()
  })
  return obj
}

const allTeams: Array<TeamProps> = [
  addLoginId(testOne),
  addLoginId(testTwo),
  addLoginId(testThree),
  Developer,
]

const allLoginIds: Record<string, LoginIdProps> = {}
const allEmails: Record<string, EmailProps> = {}

allTeams.forEach((team) => {
  team.members.forEach((member, index) => {
    allLoginIds[member.loginId] = {
      teamName: team.teamName,
      index,
      email: member.email,
    }
    allEmails[member.email] = {
      teamName: team.teamName,
      index,
      loginId: member.loginId,
    }
  })
})

const teams: TeamsDatabase = makeTeams(allTeams)
const participants: ParticipantsDatabase = Object.assign(teams, {
  allLoginIds,
  allEmails,
})

export default participants
export { SOARInit }
