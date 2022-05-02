import axios from 'axios'
import { timestamp } from './utils/timestamp'
import { cloud } from './utils/firebase'

const fn = 'development-deleteAllUsers'
timestamp(fn)

const whitelist = ['k@sunnus.com', 'r@sunnus.com', 'kevin@sunnus.com']
const uidWhitelist = [
  'VMXuhnIg2jcKGGt9y6D1GDV9gBR2',
  'joDEJYPYvfQDS8ukW7bG6MEQUY53',
  'xo05ywdQhsSLYvXe0CIozFXYnB32',
]

axios.post(cloud(fn), { whitelist }).then((res) => {
  const data = res.data
  console.debug(data)
})

axios
  .post(cloud('development-clearCollection'), {
    collection: 'users',
    whitelist: uidWhitelist,
  })
  .then((res) => {
    const data = res.data
    console.debug(data)
  })
