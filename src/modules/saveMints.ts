import { getMintModel } from '../db/models/MintModel'

type MintMetadata = {
  name?: string
  imageUrl?: string
  attributes?: Attributes
}

type Attributes = {
  [key: string]: string
}

export const saveMints = async (
  collectionName: string,
  mints: MintMetadata[]
) => {
  const mintModel = getMintModel(collectionName)
  //   const mintData = await MintModel.create(mintProps)
  const mintData = await mintModel.insertMany(mints)

  console.log(mintData)
}
