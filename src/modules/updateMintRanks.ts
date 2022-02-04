import { getMintModel, MintType } from '../db/models/MintModel'

type Trait = {
  [key: string]: number
}

type AttributeRanks = {
  [key: string]: Trait
}
export const updateMintRanks = async (collectionName: string, mints: MintType[], attributeRanks: AttributeRanks) => {
  const mintModel = getMintModel(collectionName)
  let bulkOp = mintModel.collection.initializeUnorderedBulkOp()
  let opsCount = 0

  mints.forEach(async mint => {
    const ranks = attributeRanks[mint._id]

    bulkOp.find({ _id: mint._id }).updateOne({ $set: { ranks } })
  })

  if (++opsCount % 10000 === 0) {
    await bulkOp.execute()
    bulkOp = mintModel.collection.initializeUnorderedBulkOp()
  }
  await bulkOp.execute()
}
