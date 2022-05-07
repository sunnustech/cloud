import { sendFullQRRequest } from '.'

const packet = {
  points: 70,
  command: 'completeStage',
  station: 'Sotong Houze',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
