import { sendFullQRRequest } from '.'

const packet = {
  points: 70,
  command: 'completeStage',
  station: 'Nerf Battle',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
