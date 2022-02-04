import express from 'express'
import { connectDatabase } from './db/connectDatabase'
const app = express()
import bodyParser from 'body-parser'
import { getBulkMetadata } from './utils/getMintMetadata'
import { saveMints } from './modules/saveMints'
import { getMint } from './modules/getMint'
import { saveRarities } from './utils/saveRarities'
import { saveCollectionInfo } from './modules/saveCollectionInfo'
import { getMintAddresses } from './utils/getMintAddresses'
import { CollectionInfoType } from './db/models/CollectionInfoModel'
import { getCollectionInfo } from './modules/getCollectionInfo'

const PORT = 8000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Expresssss + TypeScript Server'))

app.post('/save-collection', async (req, res) => {
  if (!req.body?.creatorId) return res.status(500).send('No creatorId found.')
  if (!req.body?.collectionName) return res.status(500).send('No collectionName found.')
  if (!req.body?.attributeTypes) return res.status(500).send('No attributeTypes found.')
  console.log(`[INFO]: Save collection ${req.body?.collectionName}`)

  const collectionInfo: CollectionInfoType = {
    name: req.body?.collectionName,
    creatorId: req.body?.creatorId,
    attributeTypes: req.body?.attributeTypes,
    updatedAt: new Date(),
  }

  await saveCollectionInfo(collectionInfo)

  const mintAddresses = await getMintAddresses(req.body.creatorId)

  // const mintAddresses = ['E42FAenvc3VDz2uyKgjvs8pBsi8Hk7tsMo8c9prEuj2b', '7fwBaWCzQb2Fc2coVfoHVcT4MxBesAHKXCiRvTKSTj15']
  console.log('[INFO]: Total Mint Addresses', mintAddresses.length)

  const mints = await getBulkMetadata(mintAddresses)
  if (!mints) return res.status(500).send('No mints found.')
  await saveMints(collectionInfo, mints)
  await saveRarities(collectionInfo)

  return res.send('done')
})

app.post('/update-rarity', async (req, res) => {
  if (!req.body?.collectionName) return res.status(500).send('No collectionName found.')

  const collectionInfo = await getCollectionInfo(req.body.collectionName)
  if (!collectionInfo) return res.status(500).send('No collectionInfo found.')

  await saveRarities(collectionInfo)

  return res.json({ success: true })
})

app.post('/get-mint', async (req, res) => {
  if (!req.body?.collectionName) return res.status(500).send('No collectionName found.')
  if (!req.body?.query) return res.status(500).send('No query found.')

  const mint = await getMint(req.body.collectionName, req.body.query)
  console.log(mint)

  if (mint) return res.json({ ...mint, found: true })
  return res.json({ found: false })
})

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
  })
})
