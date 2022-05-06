import { TSSSchedule, Rounds, TSSDatabase } from '../../../types/TSS'
import { emptyRounds } from './emptyRounds'
import { filledRounds } from './filledRounds'
import { createMatch, createEmptyMatches } from './utils'

export const sampleRounds: Rounds = {
  round_robin: {},
  quarterfinals: {
    0: createMatch('Independent_Decorators', 'Gentle_Sweaters'),
    1: createMatch('Known_Painters', 'Modest_Liberators'),
    2: createMatch('Poor_Philosophers', 'Written_Particulars'),
    3: createMatch('Handicapped_Silvers', 'Remaining_Masters'),
    4: createMatch('Vulnerable_Council', 'Real_Lasers'),
    5: createMatch('Elaborate_Solvents', 'Sophisticated_Crystals'),
    6: createMatch('Influential_Realtors', 'Irrelevant_Readers'),
    7: createMatch('Harvard_Graduates', 'Lingustic_Reformers'),
  },
  semifinals: createEmptyMatches(2),
  finals: createEmptyMatches(1),
  champions: '',
}

const schedule: TSSSchedule = [
  {
    id: 1,
    title: 'Dodgeball Semi-finals',
    sport: 'dodgeball',
    time: '15:00',
    venue: 'Court 3',
    teams: ['HS123', 'Known_Painters'],
  },
  {
    id: 2,
    title: 'Volleyball Qualifiers',
    sport: 'volleyball',
    time: '15:00',
    venue: 'Court 4',
    teams: ['HS123', 'Modest_Liberators'],
  },
  {
    id: 3,
    title: 'Frisbee Finals',
    sport: 'frisbee',
    time: '15:00',
    venue: 'Court 5',
    teams: ['Modest_Liberators', 'Known_Painters'],
  },
  {
    id: 4,
    title: 'Prize Presentation',
    sport: 'misc',
    time: '16:00',
    venue: 'Stage',
    teams: [],
  },
]

const TSS: TSSDatabase = {
  dodgeball: sampleRounds,
  captainsBall: sampleRounds,
  touchRugby: sampleRounds,
  frisbee: sampleRounds,
  volleyball: sampleRounds,
  tchoukball: sampleRounds,
  data: {
    schedule,
  },
}

export { filledRounds, emptyRounds }
export default TSS
