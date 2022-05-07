import { sendQRRequest } from '.'

async function main() {
  const a = await sendQRRequest('resumeTimer')
  console.log(a)
}


main()
