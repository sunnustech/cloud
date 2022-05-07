import { sendFullQRRequest } from '.'

const packet = {
  points: 4,
  command: 'completeStage',
  station: 'Snake and Ladders',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
