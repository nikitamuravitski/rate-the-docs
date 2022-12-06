import { z } from 'zod'
import { Language } from './Documentation'

export const language = z.union([
  z.literal(Language.java),
  z.literal(Language.javascript),
  z.literal(Language.rust),
  z.literal(Language.python),
])

export const docVersion = z.tuple([
  z.union([z.number().positive(), z.null()]),
  z.union([z.number().positive(), z.null()]),
  z.union([z.number().positive(), z.null()]),
])
  .refine((doc) => {
    let isDocVersionValid = true
    doc.forEach((cur, i) => {
      console.log(i, i < doc.length - 1, cur, typeof cur === null, doc[i + 1] !== null)
      if (i < doc.length - 1 && cur === null && doc[i + 1] !== null) isDocVersionValid = false
    })
    return isDocVersionValid
  }, 'Version must have proper order')