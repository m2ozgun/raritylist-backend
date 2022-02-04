import { getMintModel } from '../db/models/MintModel'

type SortQuery = {
  [key: string]: number
}

export const getMints = async (
  collectionName: string,
  sortBy: string | null = ''
) => {
  const mintModel = getMintModel(collectionName)

  if (sortBy) {
    const sortQuery: SortQuery = {}
    sortQuery[sortBy] = 1

    console.log('sortQuery', sortQuery)

    return await mintModel.find().sort(sortQuery)
  }

  return await mintModel.find()
}
