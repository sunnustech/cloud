import axios from 'axios'
import { timestamp } from './timestamp'
import { cloud } from './firebase'

const fn = 'deleteDocs'
timestamp(fn)

const collection = 'teams'
const docList = [
  'auto_one',
  'auto_two',
  'auto_three',
  'auto_four',
  'auto_five',
  'auto_six',
]

axios
  .post(cloud(fn), { message: 'please', collection, docList })
  .then((res) => {
    const data = res.data
    console.log(data)
  })
