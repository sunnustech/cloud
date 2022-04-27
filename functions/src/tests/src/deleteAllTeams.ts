import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-clearCollection'
timestamp(fn)

const collection = 'teams'

axios
  .post(cloud(fn), {
    message: 'please',
    collection,
    whitelist: ['__init__'],
  })
  .then((res) => {
    const data = res.data
    console.debug(data)
  })
