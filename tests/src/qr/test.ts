import { sendQRRequest, Command } from '.'

const colors = {
  reset :"\x1b[0m",
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[2m',
}

const clog = (color: string) => (text: string) => {
  process.stdout.write(`${color}${text}${colors.reset} `)
}

const log = {
  red: clog(colors.red),
  green: clog(colors.green),
  yellow: clog(colors.yellow),
  blue: clog(colors.blue),
  magenta: clog(colors.magenta),
  cyan: clog(colors.cyan),
  white: clog(colors.white),
  gray: clog(colors.gray),
}

const bprint = (b: boolean) => {
  if (b === true) {
    log.green('passed')
  } else {
    log.red('failed')
  }
}

async function sendAndCheck(cmd: Command, toBe: string) {
  const response = await sendQRRequest(cmd)
  bprint(response === toBe)
  console.log(`${colors.gray}${cmd}${colors.reset} ${response}`)
}

function nextRun() {
  console.log('───────────────────')
}

async function main() {
  // reset timer for a clean test
  await sendAndCheck('resetTimer', 'ok')

  // pre-start checks
  nextRun()
  await sendAndCheck('resumeTimer', 'not in game')
  await sendAndCheck('pauseTimer', 'not in game')
  await sendAndCheck('stopTimer', 'not in game')

  nextRun()
  await sendAndCheck('startTimer', 'ok')
  await sendAndCheck('startTimer', 'already started')
  await sendAndCheck('stopTimer', 'ok')
  await sendAndCheck('resetTimer', 'ok')

  nextRun()
  await sendAndCheck('startTimer', 'ok')
  await sendAndCheck('resumeTimer', 'timer already running')
  await sendAndCheck('stopTimer', 'ok')
  await sendAndCheck('resetTimer', 'ok')

  nextRun()
  await sendAndCheck('startTimer', 'ok')
  await sendAndCheck('pauseTimer', 'ok')
  await sendAndCheck('stopTimer', 'timer already paused')
  await sendAndCheck('resumeTimer', 'ok')
  await sendAndCheck('stopTimer', 'ok')
  await sendAndCheck('resetTimer', 'ok')
}
main()
