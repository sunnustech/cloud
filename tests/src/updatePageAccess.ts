import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-updatePageAccess'

const pages = {
  pages: 'is up',
}

timestamp(fn)

axios
  .post(cloud(fn), {
    message: 'please',
    pages,
  })
  .then((res) => {
    const data = res.data
    console.debug(data)
  })
