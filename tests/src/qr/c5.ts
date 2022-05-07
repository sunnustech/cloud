import { sendFullQRRequest } from '.'

const packet = {
  points: 70,
  command: 'completeStage',
  station: 'GOLF',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
