import { DocVersion } from '../types/Documentation';
export default {
  fold: (value: DocVersion): string => {
    return value
      .filter(item => item !== null)
      .join('.')

  },
  unfold: (value: string): DocVersion => {
    const splitValue = value.split('.').map(item => +item)
    const result: DocVersion = [
      splitValue[0] === undefined ? null : +splitValue[0],
      splitValue[1] === undefined ? null : +splitValue[1],
      splitValue[2] === undefined ? null : +splitValue[2],
    ]
    return result
  }
}
