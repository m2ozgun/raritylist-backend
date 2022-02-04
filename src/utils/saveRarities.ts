import { MintType } from '../db/models/MintModel'
import { getMints } from '../modules/getMints'
import { updateCollectionTraitOccurences } from '../modules/updateCollectionTraitOccurences'

type Trait = {
  [key: string]: number
}

type Occurence = {
  [key: string]: Trait
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

export const saveTraitOccurences = async (collectionName: string) => {
  const mints = await getMints(collectionName)
  const traitOccurences = calculateTraitOccurences(mints)
  await updateCollectionTraitOccurences(collectionName, traitOccurences)
}
