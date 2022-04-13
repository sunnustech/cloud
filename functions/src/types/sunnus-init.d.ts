import { RegisteredEvents } from "./teams"

export type NewTeamProps = {
  teamName: string
  registeredEvents: RegisteredEvents
  direction: 'A' | 'B'
}
