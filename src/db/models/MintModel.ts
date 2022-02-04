import { Document, model, Schema } from 'mongoose'

export type MintType = Document & {
  attributes: object
  imageUrl: string
  name: string
}

export const Mint = new Schema({
  attributes: Object,
  imageUrl: String,
  name: String,
})

export default model<MintType>('mint', Mint)
