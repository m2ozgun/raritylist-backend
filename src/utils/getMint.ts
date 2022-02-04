import { getMintModel } from '../db/models/MintModel'

export const getMint = async (collectionName: string, query: string) => {
  const mintModel = getMintModel(collectionName)

  return await mintModel.findOne({ name: { $regex: query } })
}
