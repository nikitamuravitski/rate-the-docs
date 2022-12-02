export type DocumentationWithRatings = DocumentationInner & { ratings: Rating[] }
export type DocumentatnioWithVotes = DocumentationInner & { votes: Vote[] }
export type Documentation = DocumentationWithRatings | DocumentatnioWithVotes

export type DocumentationInner = {
  id: string
  name: string
  description: string
  status: 'voting' | 'declined' | 'accepted'
  npmPackageName: string
  linkToDocs: string
  docVersion: string
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