import CollectionInfoModel from '../db/models/CollectionInfoModel'

export const getCollectionInfo = async (collectionName: string) => {
  return await CollectionInfoModel.findOne({ name: collectionName })
}
