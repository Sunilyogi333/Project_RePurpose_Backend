import express from 'express'
import 'reflect-metadata'
import connectDb from './db/mongoose.connection' // Database connection function
import { EnvironmentConfiguration } from './config/env.config' // Config with environment variables
// import routes from './routes';  // Import all routes from the routes folder
import middleware from './middlewares';  // Custom midd/leware setup

const app = express()

// Initialize middleware and routes
async function bootStrap() {
  try {
    // Initialize the database connection
    await connectDb()

    await middleware(app);

    // Use the routes with the '/api' prefix
    // app.use('/api', routes);  // All API routes will be prefixed with '/api'

    // Start the server
    app.listen(EnvironmentConfiguration.PORT, () => {
      console.info(`Server started at http://localhost:${EnvironmentConfiguration.PORT}`)
    })

  } catch (error) {
    console.error('Error during server setup:', error)
    process.exit(1) // Exit the process if an error occurs
  }
}

// Boot the application
bootStrap()
