import axios from 'axios'
import { timestamp } from './timestamp'

const base = 'http://localhost:5001/sunnus-22/us-central1'
const fn = 'createUsers'

timestamp()
console.log('function: createUsers')
axios
  .post(`${base}/${fn}`, {
    data: {
      something: 'is up',
    },
  })
  .then((res) => console.log(res.data))
