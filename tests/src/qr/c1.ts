import { sendFullQRRequest } from '.'

const packet = {
  points: 1,
  command: 'completeStage',
  station: 'Slide',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
