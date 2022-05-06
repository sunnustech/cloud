import { Rounds } from 'types'
import { createMatch } from './utils'

export const filledRounds: Rounds = {
  round_robin: {},
  round_of_32: {
    0: createMatch('Independent_Decorators', 'Gentle_Sweaters'),
    1: createMatch('Known_Painters', 'Modest_Liberators'),
    2: createMatch('Poor_Philosophers', 'Written_Particulars'),
    3: createMatch('Handicapped_Silvers', 'Remaining_Masters'),
    4: createMatch('Vulnerable_Council', 'Real_Lasers'),
    5: createMatch('Elaborate_Solvents', 'Sophisticated_Crystals'),
    6: createMatch('Influential_Realtors', 'Irrelevant_Readers'),
    7: createMatch('Harvard_Graduates', 'Lingustic_Reformers'),
    8: createMatch('Unfortunate_Landlords', 'Magical_Publishers'),
    9: createMatch('Violent_Bathers', 'Eventual_Resters'),
    10: createMatch('Intimate_Creditors', 'Domestic_Populators'),
    11: createMatch('Blonde_Stoppers', 'Mass_Activators'),
    12: createMatch('Emotional_Writers', 'Rich_Searchers'),
    13: createMatch('Crucial_Managers', 'Coastal_Housers'),
    14: createMatch('Useful_Wanters', 'Foolish_Reasoners'),
    15: createMatch('Representative_Witnesses', 'Prone_Artists'),
  },
  round_of_16: {
    0: createMatch('Independent_Decorators', 'Modest_Liberators'),
    1: createMatch('Poor_Philosophers', 'Remaining_Masters'),
    2: createMatch('Vulnerable_Council', 'Sophisticated_Crystals'),
    3: createMatch('Influential_Realtors', 'Lingustic_Reformers'),
    4: createMatch('Unfortunate_Landlords', 'Eventual_Resters'),
    5: createMatch('Intimate_Creditors', 'Mass_Activators'),
    6: createMatch('Emotional_Writers', 'Coastal_Housers'),
    7: createMatch('Useful_Wanters', 'Prone_Artists'),
  },
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
