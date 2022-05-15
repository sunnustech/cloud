import { sendFullQRRequest } from '.'

const packet = {
  points: 32,
  command: 'addPoints',
  station: 'Sotong Houze',
  facilitator: 'Khang',
  teamName: 'developer_team',
}

sendFullQRRequest(packet)
