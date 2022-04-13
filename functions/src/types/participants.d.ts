import { Team } from './sunnus-firestore'

/*
 * To be Firestore-friendly, the final form has to be an object,
 * and first-level values cannot be arrays
 */
type TeamsDatabase = Record<string, Team>
