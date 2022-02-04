import { CollectionInfoType } from '../db/models/CollectionInfoModel'
import { getMintModel } from '../db/models/MintModel'

type MintMetadata = {
  name?: string
  imageUrl?: string
  attributes?: Attributes
  attributeProbabilities?: object
  ranks?: object
}

type Attributes = {
  [key: string]: string
}

export const saveMints = async (collectionInfo: CollectionInfoType, mints: MintMetadata[]) => {
  const mintModel = getMintModel(collectionInfo.name)
  const mintData = await mintModel.insertMany(mints)

  console.log(mintData)
}
