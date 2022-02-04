import { Document, model, Schema, Model } from 'mongoose'

export type MintType = Document & {
  attributes: object
  imageUrl: string
  name: string
  attributeProbabilities: object
}

export const Mint = new Schema({
  attributes: Object,
  imageUrl: String,
  name: String,
  attributeProbabilities: Object,
})

export const getMintModel = (collectionName: string): Model<MintType> => {
  return model<MintType>(collectionName, Mint)
}
