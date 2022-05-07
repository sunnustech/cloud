import { sendQRRequest, createOneTeam, Command } from '.'

const colors = {
  reset: '\x1b[0m',
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

async function nextRun(c: Command[]) {
  console.log('───────────────────')
  console.log('setup', c)
}

async function setup(cmd: Command[]) {
  for (const c of cmd) {
    await sendQRRequest(c)
  }
}

async function checkWithContext(context: Command[], cmd: Command, toBe: string) {
  await setup(context)
  await sendAndCheck(cmd, toBe)
}

async function all() {
  await createOneTeam()
  var c: Command[] = ['resetTimer']
  nextRun(c)
  await checkWithContext(c, 'startTimer', 'ok')
  await checkWithContext(c, 'resumeTimer', 'not in game')
  await checkWithContext(c, 'pauseTimer', 'not in game')
  await checkWithContext(c, 'stopTimer', 'not in game')

  c = ['resetTimer', 'startTimer']
  nextRun(c)
  await checkWithContext(c, 'startTimer', 'already started')
  await checkWithContext(c, 'resumeTimer', 'timer already running')
  await checkWithContext(c, 'pauseTimer', 'ok')
  await checkWithContext(c, 'stopTimer', 'ok')

  c.push('pauseTimer')
  nextRun(c)
  await checkWithContext(c, 'startTimer', 'already started')
  await checkWithContext(c, 'resumeTimer', 'ok')
  await checkWithContext(c, 'pauseTimer', 'timer already paused')
  await checkWithContext(c, 'stopTimer', 'timer already paused')

  c.push('resumeTimer')
  nextRun(c)
  await checkWithContext(c, 'startTimer', 'already started')
  await checkWithContext(c, 'resumeTimer', 'timer already running')
  await checkWithContext(c, 'pauseTimer', 'ok')
  await checkWithContext(c, 'stopTimer', 'ok')

  c.push('stopTimer')
  nextRun(c)
  await checkWithContext(c, 'startTimer', 'already started')
  await checkWithContext(c, 'resumeTimer', 'not in game')
  await checkWithContext(c, 'pauseTimer', 'not in game')
  await checkWithContext(c, 'stopTimer', 'not in game')
}

async function unit() {
  await checkWithContext(['resetTimer', 'startTimer'], 'resumeTimer', 'timer already running')
}

all()
