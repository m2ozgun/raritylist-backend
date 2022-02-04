import { Connection, PublicKey } from '@solana/web3.js'
import bs58 from 'bs58'

const API_URL = 'https://magiceden.genesysgo.net/'
const connection = new Connection(API_URL)

const TOKEN_METADATA_PROGRAM = new PublicKey(
  'metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'
)

export const getMintAddresses = async (firstCreatorAddress: string) => {
  const candyMachineCreator = new PublicKey(firstCreatorAddress)

  const metadataAccounts = await connection.getProgramAccounts(
    TOKEN_METADATA_PROGRAM,
    {
      // The mint address is located at byte 33 and lasts for 32 bytes.
      dataSlice: { offset: 33, length: 32 },

      filters: [
        { dataSize: 679 }, // Metadata accounts

        {
          memcmp: {
            offset: 326, // Creator array start
            bytes: candyMachineCreator.toBase58(),
          },
        },
      ],
    }
  )

  return metadataAccounts.map(metadataAccountInfo =>
    bs58.encode(metadataAccountInfo.account.data)
  )
}
