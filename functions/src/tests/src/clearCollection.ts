import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-clearCollection'
timestamp(fn)

const collection = 'schedule'

axios
  .post(cloud(fn), {
    message: 'please',
    collection,
    blacklist: ['lLyXasQlsb0ZQkkm85GZ'],
  })
  .then((res) => {
    const data = res.data
    console.log(data)
  })
