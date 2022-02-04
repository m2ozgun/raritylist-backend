import { getMintModel, MintType } from '../db/models/MintModel'
import { getMints } from '../modules/getMints'
import { updateCollectionTraitOccurences } from '../modules/updateCollectionTraitOccurences'

type Trait = {
  [key: string]: number
}

type Occurence = {
  [key: string]: Trait
}

type AttributeProbabilities = {
  [key: string]: number
}

type AttributeRanks = {
  [key: string]: number
}

const calculateTraitOccurences = (mints: MintType[]) => {
  const traitOccurences: Occurence = {}

  for (const mint of mints) {
    const { attributes } = mint

    for (const [trait, traitValue] of Object.entries(attributes)) {
      if (!traitOccurences[trait]) traitOccurences[trait] = {}
      traitOccurences[trait][traitValue] = traitOccurences[trait][traitValue]
        ? traitOccurences[trait][traitValue] + 1
        : 1
    }
  }
  return traitOccurences
}

const calculateMintAttributeProbabilities = (
  mint: MintType,
  traitOccurences: Occurence
) => {
  const { attributes } = mint
  const attributeProbabilities: AttributeProbabilities = {}

  for (const [trait, traitValue] of Object.entries(attributes)) {
    const traitOccurence = traitOccurences[trait][traitValue]

    attributeProbabilities[trait] = traitOccurence / 4600
  }

  const totalProbability = Object.values(attributeProbabilities).reduce(
    (a, b) => a + b,
    0
  )
  attributeProbabilities['__aggregate__'] =
    totalProbability / Object.keys(attributeProbabilities).length

  return attributeProbabilities
}

export const saveTraitOccurences = async (collectionName: string) => {
  const mints = await getMints(collectionName)
  const traitOccurences = calculateTraitOccurences(mints)
  await updateCollectionTraitOccurences(collectionName, traitOccurences)

  const mintModel = getMintModel(collectionName)
  let bulkOp = mintModel.collection.initializeUnorderedBulkOp()
  let opsCount = 0

  mints.forEach(async mint => {
    const attributeProbabilities = calculateMintAttributeProbabilities(
      mint,
      traitOccurences
    )

    console.log(attributeProbabilities)

    bulkOp
      .find({ _id: mint._id })
      .updateOne({ $set: { attributeProbabilities } })
  })

  if (++opsCount % 10000 === 0) {
    await bulkOp.execute()
    bulkOp = mintModel.collection.initializeUnorderedBulkOp()
  }
  await bulkOp.execute()
}
