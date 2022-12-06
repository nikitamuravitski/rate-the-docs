import { z } from 'zod'
import { Language } from './Documentation'

export const language = z.union([
  z.literal(Language.java),
  z.literal(Language.javascript),
  z.literal(Language.rust),
  z.literal(Language.python),
])