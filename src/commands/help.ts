import { Command, CommandContext } from 'src/bot/Command'

export default class HelpCommand extends Command {
    constructor() {
        super()

        this.name = 'help'
    }

    async execute(context: CommandContext) {
        await context.message.channel.send('Your own help message!')
    }
}
