import { Document, model, Schema } from 'mongoose'

export type CollectionInfoType = Document & {
  name: string
  creatorId: string
  traitOccurences: object
  updatedAt: Date
}

export const CollectionInfo = new Schema({
  name: String,
  creatorId: String,
  traitOccurences: Object,
  updatedAt: Date,
})

export default model<CollectionInfoType>('collection-info', CollectionInfo)
