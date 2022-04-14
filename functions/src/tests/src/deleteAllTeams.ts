import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-deleteDocs'
timestamp(fn)

const collection = 'teams'
const docList = [
  'auto_one',
  'auto_two',
  'auto_three',
  'auto_four',
  'auto_five',
  'auto_six',
  'auto_seven',
  'auto_eight',
  'auto_nine',
  'auto_ten',
  'auto_eleven',
  'auto_twelve',
]

axios
  .post(cloud(fn), { message: 'please', collection, docList })
  .then((res) => {
    const data = res.data
    console.log(data)
  })
