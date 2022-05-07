import { sendFullQRRequest } from '.'

const packet = {
  points: 70,
  command: 'completeStage',
  station: 'Relay2Maze',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
