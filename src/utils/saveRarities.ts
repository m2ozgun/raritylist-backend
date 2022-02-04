import { MintType } from '../db/models/MintModel'
import { getMints } from '../modules/getMints'
import { updateCollectionTraitOccurences } from '../modules/updateCollectionTraitOccurences'
import { updateMintProbabilities } from '../modules/updateMintProbabilities'
import { updateMintRanks } from '../modules/updateMintRanks'
type Trait = {
  [key: string]: number
}

type Occurence = {
  [key: string]: Trait
}

type AttributeProbabilities = {
  [key: string]: Trait
}

type AttributeRanks = {
  [key: string]: Trait
}

// get occurence counts for categorical attributes
const countAttributeOccurences = (mints: MintType[]) => {
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

// get attribute probabilities for catorical attributes
const calculateMintAttributeProbabilities = (
  mints: MintType[],
  traitOccurences: Occurence
) => {
  const attributeProbabilities: AttributeProbabilities = {}

  for (const mint of mints) {
    if (!attributeProbabilities[mint._id]) attributeProbabilities[mint._id] = {}

    const { attributes } = mint

    for (const [trait, traitValue] of Object.entries(attributes)) {
      const traitOccurence = traitOccurences[trait][traitValue]

      attributeProbabilities[mint._id][trait] = traitOccurence / 4600
    }

    const totalProbability = Object.values(
      attributeProbabilities[mint._id]
    ).reduce((a, b) => a + b, 0)
    attributeProbabilities[mint._id]['__aggregate__'] =
      totalProbability / Object.keys(attributeProbabilities[mint._id]).length
  }

  return attributeProbabilities
}

const calculateMintAttributeRanks = async (
  collectionName: string,
  traits: string[]
) => {
  const attributeRanks: AttributeRanks = {}

  for (const trait of traits) {
    const sortedMints = await getMints(
      collectionName,
      `attributeProbabilities.${trait}`
    )

    for (const mint of sortedMints) {
      if (!attributeRanks[mint._id]) attributeRanks[mint._id] = {}

      attributeRanks[mint._id][trait] = sortedMints.findIndex(
        x => x._id === mint._id
      )
    }
  }

  return attributeRanks
}

const saveRanks = async (collectionName: string, mints: MintType[]) => {
  const traitOccurences = countAttributeOccurences(mints)
  const traits = [...Object.keys(traitOccurences), '__aggregate__']

  const attributeRanks = await calculateMintAttributeRanks(
    collectionName,
    traits
  )

  await updateMintRanks(collectionName, mints, attributeRanks)
}

export const saveOccurences = async (
  collectionName: string,
  mints: MintType[]
) => {
  const attributeOccurences = countAttributeOccurences(mints)
  await updateCollectionTraitOccurences(collectionName, attributeOccurences)
}

export const saveProbabilities = async (
  collectionName: string,
  mints: MintType[]
) => {
  const attributeOccurences = countAttributeOccurences(mints)

  const attributeProbabilities = calculateMintAttributeProbabilities(
    mints,
    attributeOccurences
  )

  await updateMintProbabilities(collectionName, mints, attributeProbabilities)
}

export const saveRarities = async (collectionName: string) => {
  const mints = await getMints(collectionName)

  await saveOccurences(collectionName, mints)
  await saveProbabilities(collectionName, mints)
  await saveRanks(collectionName, mints)
}
