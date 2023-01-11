import { z } from 'zod'
import { versionRange } from './zodTypes'

export type VersionRange = z.infer<typeof versionRange>

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