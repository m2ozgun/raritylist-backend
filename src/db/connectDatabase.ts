import { connect } from 'mongoose'

export const connectDatabase = async () => {
  if (!process.env.MONGO_URI) throw new Error('Mongo URI is not defined.')

  await connect(process.env.MONGO_URI)
  console.log('Database Connection established.')
}
