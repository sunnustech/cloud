import * as sunnus from '../types/classes'

export class BaseTeam implements sunnus.Team {
  members: string[]
  teamName: string
  constructor(props: sunnus.Init.Team) {
    this.teamName = props.teamName
    this.members = []
  }
}
