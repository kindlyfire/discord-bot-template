import { Command, CommandContext } from './Command'
import { Message } from 'discord.js'
import { bot } from '.'

export class CommandManager extends Command {
    commands: Command[] = []

    addCommand(command: Command) {
        this.commands.push(command)
    }

    async onMessage(message: Message) {
        const content = message.content
        const prefix = bot.config.DISCORD_PREFIX

        if (content.slice(0, prefix.trim().length) === prefix.trim()) {
            const args = content
                .slice(prefix.length)
                .replace(/\s+/g, ' ')
                .trim()
                .split(' ')

            try {
                await this.execute({
                    args,
                    commandName: '',
                    message
                })
            } catch (e) {
                console.log('Error handling message: ' + message.content)
            }
        }
    }

    async execute({ message, args }: CommandContext) {
        const commandName = args.length > 0 ? args[0] : '__default'

        for (let command of this.commands) {
            if ([command.name, ...command.aliases].includes(commandName)) {
                await command.execute({
                    args: args.slice(1),
                    commandName,
                    message
                })
                break
            }
        }
    }
}
