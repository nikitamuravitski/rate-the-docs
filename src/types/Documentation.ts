import { z } from 'zod'
import { docVersion } from './zodTypes'

export type DocVersion = z.infer<typeof docVersion>

export type DocumentationWithRatings = DocumentationInner & { ratings: Rating[] }
export type DocumentatnioWithVotes = DocumentationInner & { votes: Vote[] }
export type Documentation = DocumentationWithRatings | DocumentatnioWithVotes

export type DocumentationInner = {
  id: string
  name: string
  description: string
  status: 'voting' | 'declined' | 'accepted'
  packageName: string
  linkToDocs: string
  docVersion: string
  language: `${Language}`
}

export type Rating = {
  id: string
  value: number
  userId: string
  documentationId: string
}

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