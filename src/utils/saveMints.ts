import MintModel from '../db/models/MintModel'

type MintMetadata = {
  name?: string
  imageUrl?: string
  attributes?: Attributes
}

type Attributes = {
  [key: string]: string
}

export const saveMints = async (mints: MintMetadata[]) => {
  console.log('mints', mints)

  //   const mintData = await MintModel.create(mintProps)
  const mintData = await MintModel.insertMany(mints)

  console.log(mintData)
}
