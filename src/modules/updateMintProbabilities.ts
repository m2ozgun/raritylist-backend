import { getMintModel, MintType } from '../db/models/MintModel'

type Trait = {
  [key: string]: number
}

type AttributeProbabilities = {
  [key: string]: Trait
}

export const updateMintProbabilities = async (
  collectionName: string,
  mints: MintType[],
  attributeRanks: AttributeProbabilities
) => {
  const mintModel = getMintModel(collectionName)
  let bulkOp = mintModel.collection.initializeUnorderedBulkOp()
  let opsCount = 0

  mints.forEach(async mint => {
    const probabilities = attributeRanks[mint._id]

    bulkOp
      .find({ _id: mint._id })
      .updateOne({ $set: { attributeProbabilities: probabilities } })
  })

  if (++opsCount % 10000 === 0) {
    await bulkOp.execute()
    bulkOp = mintModel.collection.initializeUnorderedBulkOp()
  }
  await bulkOp.execute()
}
