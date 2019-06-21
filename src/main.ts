import { bot } from './bot'
import { Config } from './interfaces'

const config: Config = require('dotenv').config().parsed

bot.run(config)
