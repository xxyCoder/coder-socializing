export function judgeIsObject(arg: any) {
  return typeof arg === 'object' && arg !== null
}

export function toStr(arg: any) {
  if (!judgeIsObject(arg)) {
    return String(arg)
  }

  let res = ''
  if (Array.isArray(arg)) {
    arg.sort()
    arg.forEach(item => {
      res += toStr(item) + '#&'
    })
  } else {
    const keys = Object.keys(arg)
    keys.sort()
    keys.forEach(k => {
      res += toStr(arg[k]) + '&#'
    })
  }
  return res
}