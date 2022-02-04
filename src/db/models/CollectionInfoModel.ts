import { Document, model, Schema } from 'mongoose'

export type Attribute = {
  name: string
  type: string
}

export type CollectionInfoType = {
  name: string
  creatorId: string
  traitOccurences?: object
  updatedAt: Date
  attributeTypes: Attribute[]
}

export type CollectionInfoDocType = Document & CollectionInfoType

export const CollectionInfo = new Schema({
  name: String,
  creatorId: String,
  traitOccurences: Object,
  updatedAt: Date,
  attributeTypes: Array,
})

export default model<CollectionInfoDocType>('collection-info', CollectionInfo)
