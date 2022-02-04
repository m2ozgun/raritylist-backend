import CollectionInfoModel from '../db/models/CollectionInfoModel'
export const updateCollectionTraitOccurences = async (collectionName: string, traitOccurences: object) => {
  const savedCollectionInfo = await CollectionInfoModel.updateOne(
    { name: collectionName },
    { $set: { traitOccurences } }
  )

  return savedCollectionInfo
}
