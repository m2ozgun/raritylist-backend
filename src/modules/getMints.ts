import { getMintModel } from '../db/models/MintModel'

export const getMints = async (collectionName: string) => {
  const mintModel = getMintModel(collectionName)

  return await mintModel.find()
}
