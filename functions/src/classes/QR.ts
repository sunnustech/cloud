export namespace QR {
  type HaventDecided =
    | 'fn01'
    | 'fn02'
    | 'fn03'
    | 'fn04'
    | 'fn05'
    | 'fn06'
    | 'fn07'
    | 'fn08'
    | 'fn09'
    | 'fn10'
    | 'fn11'
    | 'fn12'
    | 'fn13'
    | 'fn14'
    | 'fn15'
    | 'fn16'
    | 'fn17'
    | 'fn18'
    | 'fn19'
    | 'fn20'

  export type Command =
    | 'start'
    | 'pause'
    | 'stopFinal'
    | 'resume'
    | 'TimerNotRunning'
    | 'completeStage'
    | 'WrongStation'
    | 'HaveNotStartedSOAR'
    | 'AlreadyPaused'
    | 'AlreadyResumed'
    | 'AlreadyStartedSOAR'
    | 'AlreadyCompletedSOAR'
    | 'AlreadyCompletedAllStations'
    | 'AlreadyCompletedStation'
    | 'WarnStopFinal'
    | ''
    | HaventDecided

  export type DictionaryGeneratorProps = {
    command: Command
    station: string
  }

  export type CommandProps = {
    title: string
    summary: string
    action: string
    points: number
  } & DictionaryGeneratorProps
}
