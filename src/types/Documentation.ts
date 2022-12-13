import { z } from 'zod'
import { docVersion } from './zodTypes'

export type DocVersion = z.infer<typeof docVersion>

export type Vote = {
  id: string
  value: number
  userId: string
  documentationId: string
}

export enum Language {
  javascript = 'javascript',
  java = 'java',
  rust = 'rust',
  python = 'python'
}