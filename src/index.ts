import express from 'express'
import { connectDatabase } from './db/connectDatabase'
const app = express()
import bodyParser from 'body-parser'
import { getMintAddresses } from './utils/getMintAddresses'
import { getMintMetadata } from './utils/getMintMetadata'
import { saveMint } from './utils/saveMint'

const PORT = 8000

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.get('/', (req, res) => res.send('Expresssss + TypeScript Server'))

app.post('/save-collection', async (req, res) => {
  if (!req.body?.creatorId) return res.status(500).send('No creatorId found.')

  const mintAddresses = await getMintAddresses(req.body.creatorId)
  // const mintAddresses = ['E42FAenvc3VDz2uyKgjvs8pBsi8Hk7tsMo8c9prEuj2b']

  for (const address of mintAddresses) {
    const mintMetadata = await getMintMetadata(address)
    await saveMint(mintMetadata)
  }

  console.log(mintAddresses)
  return res.send('done')
})

connectDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`⚡️[server]: Server is running at https://localhost:${PORT}`)
  })
})
