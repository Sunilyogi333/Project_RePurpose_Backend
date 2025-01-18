import express, { Application } from 'express'
import compression from 'compression'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from '../routes'
import morgan from 'morgan'
import { rateLimiter } from '../utils/rateLimiter.utils'
import { EnvironmentConfiguration } from '../config/env.config'
import { Environment } from '../constants/enum'
// import swaggerUI from 'swagger-ui-express'
// import swaggerSpec from '../swagger'
import errorHandler from './error.middleware'

const middleware = (app: Application) => {
  app.use(compression())
  app.use(cors())
  app.use(cookieParser())
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
  app.use(rateLimiter)
  app.use(morgan('dev'))
  app.use('/api', router)
  app.get('/', (req, res) => {
    res.send({
      success: true,
      message: 'welcomeMessage',
      data: [],
    })
  })
  // app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

  console.log('Environment:', EnvironmentConfiguration.NODE_ENV)

  app.use(errorHandler)
}

export default middleware
