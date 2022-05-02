import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-initializeCollections'
timestamp(fn)

axios.post(cloud(fn), { please: 'thanks' }).then((res) => {
  const data = res.data
  console.debug(data)
})
