import { sendFullQRRequest } from '.'

const packet = {
  points: 2,
  command: 'completeStage',
  station: 'Sotong Houze',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
