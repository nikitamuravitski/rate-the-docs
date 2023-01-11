export default {
  fold: (value: number[]): string => {
    return value
      .filter(item => item !== null)
      .join('.')

  },
  unfold: (value: string): (number | null)[] => {
    const splitValue = value.split('.').map(item => +item)
    const result = [
      splitValue[0] === undefined ? null : +splitValue[0],
      splitValue[1] === undefined ? null : +splitValue[1],
      splitValue[2] === undefined ? null : +splitValue[2],
    ]
    return result
  }
}
