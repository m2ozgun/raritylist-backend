import CollectionInfoModel from '../db/models/CollectionInfoModel'
export const saveCollectionInfo = async (collectionInfo: object) => {
  const savedCollectionInfo = await CollectionInfoModel.create({
    ...collectionInfo,
    updatedAt: Date.now(),
  })

  return savedCollectionInfo
}
