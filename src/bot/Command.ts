import { Message } from 'discord.js'

export interface CommandContext {
    message: Message
    commandName: string
    args: string[]
}

export abstract class Command {
    name: string
    aliases: string[]

    constructor() {
        this.name = ''
        this.aliases = []
    }

    abstract execute(context: CommandContext)
}
