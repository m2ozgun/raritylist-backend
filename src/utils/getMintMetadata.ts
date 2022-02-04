import { Connection, PublicKey } from '@solana/web3.js'
import axios from 'axios'
import { deserializeUnchecked } from 'borsh'

const RPC_URL = process.env.RPC_URL
if (!process.env.RPC_URL) throw new Error('RPC URL is not defined.')

const connection = new Connection(RPC_URL as string)
const TOKEN_METADATA_PROGRAM = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

type Attributes = {
  [key: string]: string
}

type Attribute = {
  trait_type: string
  value: string
}

type MintMetadata = {
  name?: string
  imageUrl?: string
  attributes?: Attributes
}

class Creator {
  address: PublicKey
  verified: boolean
  share: number
  constructor(args: { address: PublicKey; verified: boolean; share: number }) {
    this.address = args.address
    this.verified = args.verified
    this.share = args.share
  }
}

enum MetadataKey {
  Uninitialized = 0,
  MetadataV1 = 4,
  EditionV1 = 1,
  MasterEditionV1 = 2,
  MasterEditionV2 = 6,
  EditionMarker = 7,
}

class Data {
  name: string
  symbol: string
  uri: string
  sellerFeeBasisPoints: number
  creators: Creator[] | null
  constructor(args: {
    name: string
    symbol: string
    uri: string
    sellerFeeBasisPoints: number
    creators: Creator[] | null
  }) {
    this.name = args.name
    this.symbol = args.symbol
    this.uri = args.uri
    this.sellerFeeBasisPoints = args.sellerFeeBasisPoints
    this.creators = args.creators
  }
}

class Metadata {
  key: MetadataKey
  updateAuthority: PublicKey
  mint: PublicKey
  data: Data
  primarySaleHappened: boolean
  isMutable: boolean
  masterEdition?: PublicKey
  edition?: PublicKey
  constructor(args: {
    updateAuthority: PublicKey
    mint: PublicKey
    data: Data
    primarySaleHappened: boolean
    isMutable: boolean
    masterEdition?: PublicKey
  }) {
    this.key = MetadataKey.MetadataV1
    this.updateAuthority = args.updateAuthority
    this.mint = args.mint
    this.data = args.data
    this.primarySaleHappened = args.primarySaleHappened
    this.isMutable = args.isMutable
  }
}

const METADATA_SCHEMA = new Map<any, any>([
  [
    Data,
    {
      kind: 'struct',
      fields: [
        ['name', 'string'],
        ['symbol', 'string'],
        ['uri', 'string'],
        ['sellerFeeBasisPoints', 'u16'],
        ['creators', { kind: 'option', type: [Creator] }],
      ],
    },
  ],
  [
    Creator,
    {
      kind: 'struct',
      fields: [
        ['address', [32]],
        ['verified', 'u8'],
        ['share', 'u8'],
      ],
    },
  ],
  [
    Metadata,
    {
      kind: 'struct',
      fields: [
        ['key', 'u8'],
        ['updateAuthority', [32]],
        ['mint', [32]],
        ['data', Data],
        ['primarySaleHappened', 'u8'],
        ['isMutable', 'u8'],
      ],
    },
  ],
])

async function getMetadata(address: PublicKey) {
  let metadata

  try {
    const metadataPromise = await fetchMetadataFromPDA(address)

    if (metadataPromise && metadataPromise.data.length > 0) {
      metadata = decodeMetadata(metadataPromise.data)
    }
  } catch (e) {
    console.log(e)
  }

  return metadata
}

async function fetchMetadataFromPDA(address: PublicKey) {
  const metadataKey = await getMetadataKey(address.toBase58())
  const metadataInfo = await connection.getAccountInfo(
    new PublicKey(metadataKey)
  )

  return metadataInfo
}

async function getMetadataKey(tokenMint: string): Promise<string> {
  return (
    await findProgramAddress(
      [
        Buffer.from('metadata'),
        new PublicKey(TOKEN_METADATA_PROGRAM).toBuffer(),
        new PublicKey(tokenMint).toBuffer(),
      ],
      new PublicKey(TOKEN_METADATA_PROGRAM)
    )
  )[0]
}

const findProgramAddress = async (
  seeds: (Buffer | Uint8Array)[],
  programId: PublicKey
) => {
  const result = await PublicKey.findProgramAddress(seeds, programId)
  return [result[0].toBase58(), result[1]] as [string, number]
}

const decodeMetadata = (buffer: Buffer): Metadata => {
  const metadata = deserializeUnchecked(
    METADATA_SCHEMA,
    Metadata,
    buffer
  ) as Metadata

  metadata.data.name = metadata.data.name.replace(/\0/g, '')
  metadata.data.symbol = metadata.data.symbol.replace(/\0/g, '')
  metadata.data.uri = metadata.data.uri.replace(/\0/g, '')
  metadata.data.name = metadata.data.name.replace(/\0/g, '')
  return metadata
}

export const getMintUri = async (mintAddress: string) => {
  const tokenMetadata = await getMetadata(new PublicKey(mintAddress))
  return tokenMetadata?.data.uri
}

export const getMintMetadata = async (mintAddress: string) => {
  console.log('Fetching', mintAddress)

  const mintUri = await getMintUri(mintAddress)

  if (!mintUri) throw new Error('No mint uri found.')

  // let mintData: MintMetadata
  try {
    const mintMetadata = await axios.get(mintUri)

    const { name, properties, attributes } = mintMetadata.data

    const attributesObject: Attributes = {}
    attributes.forEach((attribute: Attribute) => {
      attributesObject[attribute.trait_type] = attribute.value
    })

    const mintData = {
      attributes: attributesObject,
      imageUrl: properties.files[0].uri,
      name,
    }
    return mintData
  } catch (error) {
    console.log(error)
    return {}
  }
}

export const getBulkMetadata = async (mintAddresses: string[]) => {
  const mintPromises = mintAddresses.map(address => getMintMetadata(address))

  const mints: MintMetadata[] = await Promise.all(mintPromises)
  return mints
}
