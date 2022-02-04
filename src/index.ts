import express from 'express'
import { connectDatabase } from './db/connectDatabase'
const app = express()
import bodyParser from 'body-parser'
import { getMintAddresses } from './utils/getMintAddresses'
import { getBulkMetadata } from './utils/getMintMetadata'
import { saveMints } from './modules/saveMints'
import { getMint } from './modules/getMint'

const PORT = 8000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Expresssss + TypeScript Server'))

app.post('/save-collection', async (req, res) => {
  if (!req.body?.creatorId) return res.status(500).send('No creatorId found.')
  if (!req.body?.collectionName)
    return res.status(500).send('No collectionName found.')

  const mintAddresses = await getMintAddresses(req.body.creatorId)
  // const mintAddresses = [
  //   'E42FAenvc3VDz2uyKgjvs8pBsi8Hk7tsMo8c9prEuj2b',
  //   '7fwBaWCzQb2Fc2coVfoHVcT4MxBesAHKXCiRvTKSTj15',
  // ]
  console.log('Mint Addresses', mintAddresses.length)

  const mints = await getBulkMetadata(mintAddresses)
  if (!mints) return res.status(500).send('No mints found.')
  await saveMints(req.body.collectionName, mints)

  return res.send('done')
})

app.post('/get-mint', async (req, res) => {
  if (!req.body?.collectionName)
    return res.status(500).send('No collectionName found.')
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
