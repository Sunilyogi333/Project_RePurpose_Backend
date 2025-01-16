import mongoose from 'mongoose'
import { EnvironmentConfiguration } from '../config/env.config'

const connectDb = async (): Promise<void> => {
  console.log('Connecting to database:', EnvironmentConfiguration.DB_NAME)

  try {
    const connection = await mongoose.connect(`${EnvironmentConfiguration.MONGODB_URL}/${EnvironmentConfiguration.DB_NAME}`)
    console.log('Database connected successfully')
  } catch (error) {
    console.error('Error connecting to database:', error)
    process.exit(1)
  }
}

export default connectDb
