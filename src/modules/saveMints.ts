import { getMintModel } from '../db/models/MintModel'

type MintMetadata = {
  name?: string
  imageUrl?: string
  attributes?: Attributes
  attributeProbabilities?: object
}

type Attributes = {
  [key: string]: string
}

export const saveMints = async (
  collectionName: string,
  mints: MintMetadata[]
) => {
  const mintModel = getMintModel(collectionName)
  const mintData = await mintModel.insertMany(mints)

  console.log(mintData)
}
