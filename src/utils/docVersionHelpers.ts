import { DocVersion } from '../types/Documentation';
export default {
  fold: (value: DocVersion): string => {
    return value
      .reverse()
      .filter(item => item)
      .join('.')
  },
  unfold: (value: string) => {
    console.log(value)
  }
}