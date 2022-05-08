import { sendFullQRRequest } from '.'

const packet = {
  points: 6,
  command: 'completeStage',
  station: 'Relay2Maze',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
