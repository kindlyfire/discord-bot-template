import { Client } from 'discord.js'
import { Config } from 'src/interfaces'
import { CommandManager } from './CommandManager'
import globby from 'globby'
import path from 'path'
import { Command } from './Command'

interface CommandClass {
    new (): Command
}

export class Bot {
    client: Client
    commandManager: CommandManager
    config!: Config

    constructor() {
        this.client = new Client({
            disabledEvents: ['TYPING_START']
        })
        this.commandManager = new CommandManager()

        this.setClientEventListeners()
        this.loadCommands()
    }

    run(config: Config) {
        this.config = config

        return new Promise((resolve, reject) => {
            this.client.login(this.config.DISCORD_TOKEN)

            this.client.once('ready', () => {
                this.client.user
                    .setPresence({
                        game: {
                            name: this.config.DISCORD_GAME,
                            type: 'PLAYING'
                        }
                    })
                    .then(resolve)
                    .catch(reject)
            })
        })
    }

    async loadCommands() {
        const modules = await globby(
            path.join(__dirname, '..', 'commands', '*')
        )

        for (let mod of modules) {
            try {
                const cls: CommandClass = require(mod).default
                this.commandManager.addCommand(new cls())
            } catch (e) {
                console.error('Failed to load command: ', mod, e)
            }
        }
    }

    setClientEventListeners() {
        this.client.on('message', (message) =>
            this.commandManager.onMessage(message)
        )
    }
}

export const bot = new Bot()
