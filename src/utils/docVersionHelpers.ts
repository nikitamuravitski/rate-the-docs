import { DocVersion } from '../types/Documentation';
export default {
  fold: (value: DocVersion): string => {
    return value
      .reverse()
      .filter(item => item !== null)
      .reverse()
      .join('.')

  },
  unfold: (value: string) => {
    return value
  }
}