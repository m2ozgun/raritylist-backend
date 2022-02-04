import MintModel from '../db/models/MintModel'

type Attributes = {
  [key: string]: string
}

type Properties = {
  files: Files[]
}

type Files = {
  uri: string
}

type MintMetadata = {
  name: string
  properties: Properties
  attributes: Attribute[]
}

type Attribute = {
  trait_type: string
  value: string
}

export const saveMint = async (mintMetadata: MintMetadata) => {
  const { name, properties, attributes } = mintMetadata

  const attributesObject: Attributes = {}
  for (const attribute of attributes) {
    attributesObject[attribute.trait_type] = attribute.value
  }

  const mintProps = {
    attributes: attributesObject,
    imageUrl: properties.files[0].uri,
    name,
  }

  const mintData = await MintModel.create(mintProps)

  console.log(mintData)
}
