import { default as RNToast } from 'react-native-root-toast'

// shows a 2-second small notif at the bottom of the screen
export function Toast(string: string) {
  RNToast.show(string, {
    duration: 2000,
    opacity: 0.7,
  })
}

export function capitalizeFirstLettersAndJoin(string: string) {
  var separateWord = string.split(' ')
  for (var i = 0; i < separateWord.length; i++) {
    separateWord[i] =
      separateWord[i].charAt(0).toUpperCase() + separateWord[i].substring(1)
  }
  return separateWord.join('')
}

export function objFromArray(
  arr: Array<{ [key: string]: any }>,
  identifierKey: string
) {
  const obj: any = {}
  arr.forEach((e) => {
    obj[e[identifierKey]] = e
  })
  return obj
}
