import { sendFullQRRequest } from '.'

const packet = {
  points: 5 ,
  command: 'completeStage',
  station: 'GOLF',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
