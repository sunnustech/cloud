import * as sunnus from '../types/classes'
import { notEmpty } from '../utils/string'
import { BaseTeam } from './team'

export namespace TSS {
  export class Team extends BaseTeam {
    captainsBall: boolean
    dodgeball: boolean
    frisbee: boolean
    tchoukball: boolean
    touchRugby: boolean
    volleyball: boolean
    TSSId: string
    constructor(props: sunnus.Init.Team) {
      super({
        teamName: props.teamName,
        direction: props.direction,
        touchRugby: props.touchRugby,
        captainsBall: props.captainsBall,
        volleyball: props.volleyball,
        tchoukball: props.tchoukball,
        frisbee: props.frisbee,
        dodgeball: props.dodgeball,
      })
      this.touchRugby = notEmpty(props.touchRugby)
      this.captainsBall = notEmpty(props.captainsBall)
      this.volleyball = notEmpty(props.volleyball)
      this.tchoukball = notEmpty(props.tchoukball)
      this.frisbee = notEmpty(props.frisbee)
      this.dodgeball = notEmpty(props.dodgeball)
      this.TSSId = ''
    }
    group(): string {
      if (this.TSSId === '') {
        return 'unassigned'
      }
      return this.TSSId[0]
    }
    number(): number {
      if (this.TSSId === '') {
        return 0
      }
      return parseInt(this.TSSId[1])
    }
  }
}
