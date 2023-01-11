import { z } from 'zod'
import { Language } from './Documentation'

export const language = z.union([
  z.literal(Language.java),
  z.literal(Language.javascript),
  z.literal(Language.rust),
  z.literal(Language.python),
])

export const versionRange = z
  .tuple([z.number().nullable(), z.number().positive().nullable()])
  .refine((doc) => !doc.some(version => version === null) && doc[1]! > doc[0]!, 'Version must be valid')