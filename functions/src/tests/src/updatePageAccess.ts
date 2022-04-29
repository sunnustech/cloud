import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-updatePageAccess'
timestamp(fn)

axios
  .post(cloud(fn), {
    message: 'please',
  })
  .then((res) => {
    const data = res.data
    console.debug(data)
  })
