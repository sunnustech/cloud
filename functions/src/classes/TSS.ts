import * as sunnus from '../types/classes'

export namespace TSS {
  export class Team extends sunnus.Team {
    captainsBall: boolean
    dodgeball: boolean
    frisbee: boolean
    tchoukball: boolean
    touchRugby: boolean
    volleyball: boolean
    TSSId: string
    constructor(props: sunnus.Init.TSSTeam) {
      super({ teamName: props.teamName })
      this.captainsBall = props.registeredEvents.TSS.captainsBall
      this.dodgeball = props.registeredEvents.TSS.dodgeball
      this.frisbee = props.registeredEvents.TSS.frisbee
      this.tchoukball = props.registeredEvents.TSS.tchoukball
      this.touchRugby = props.registeredEvents.TSS.touchRugby
      this.volleyball = props.registeredEvents.TSS.volleyball
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
