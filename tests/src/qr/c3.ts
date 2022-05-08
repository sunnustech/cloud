import { sendFullQRRequest } from '.'

const packet = {
  points: 3,
  command: 'completeStage',
  station: 'Nerf Battle',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
