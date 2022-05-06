import { Rounds } from '../../../types/TSS'
import { createMatch } from './utils'

export const filledRounds: Rounds = {
  round_robin: {},
  quarterfinals: {
    0: createMatch('Independent_Decorators', 'Remaining_Masters'),
    1: createMatch('Vulnerable_Council', 'Lingustic_Reformers'),
    2: createMatch('Unfortunate_Landlords', 'Mass_Activators'),
    3: createMatch('Emotional_Writers', 'Prone_Artists'),
  },
  semifinals: {
    0: createMatch('Independent_Decorators', 'Lingustic_Reformers'),
    1: createMatch('Unfortunate_Landlords', 'Prone_Artists'),
  },
  finals: {
    0: createMatch('Independent_Decorators', 'Prone_Artists'),
  },
  champions: '',
}
