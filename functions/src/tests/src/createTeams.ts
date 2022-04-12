import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'
import { NewTeamProps } from '../../types/participants'

const fn = 'createTeams'
timestamp(fn)

const request = { message: 'requester to server, over!' }

const teamList: NewTeamProps[] = [
  {
    teamName: 'auto_one',
    direction: 'A',
    registeredEvents: {
      TSS: {
        volleyball: true,
      },
      SOAR: false
    }
  },
  {
    teamName: 'auto_two',
    direction: 'A',
    registeredEvents: {
      SOAR: true
    }
  },
  {
    teamName: 'auto_three',
    direction: 'B',
    registeredEvents: {
      SOAR: true
    }
  },
  {
    teamName: 'auto_four',
    direction: 'B',
    registeredEvents: {
      TSS: {
        volleyball: true
      }
    }
  },
  {
    teamName: 'auto_five',
    direction: 'B',
    registeredEvents: {
      TSS: {
        dodgeball: true
      }
    }
  },
  {
    teamName: 'auto_six',
    direction: 'B',
    registeredEvents: {
      TSS: {
        tchoukball: true,
        frisbee: true
      }
    }
  }
]

axios.post(cloud(fn), { teamList }).then((res) => {
  console.log(res.data)
})
