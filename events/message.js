const Discord = require('discord.js');
const config = require("../ayarlar.json");
// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
/**@param {Discord.Client} client
 * @param {Discord.messageCreate} messageCreate
 */
// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
module.exports = async (message, client) => {
// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
let prefix = config.ayarlar.prefix;
if (!message.content.startsWith(prefix) || message.author.bot) return;
const cooldowns = client.cooldowns
const args = message.content.slice(prefix.length).split(/ +/);
const commandName = args.shift().toLowerCase();
const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
if (!command) return;
if (command.guildOnly && message.channel.type !== 'GUILD_TEXT') {
    return message.reply({ content: "This command is not valid for private messages.!" });
}// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
if (command.args && !args.length) {
    let reply = `You offered no arguments, ${message.author}!`;
    if (command.usage) {
        reply += `\nConvenient use: \`${prefix}${command.name} ${command.usage}\``;
    }// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
    return message.channel.send({ content: reply });
}
if(!cooldowns.has(command.name)) {
    cooldowns.set(command.name, new Discord.Collection());
}// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
const now = Date.now();
const timestamps = cooldowns.get(command.name);
const cooldownAmount = (command.cooldown || 3) * 1000;
if(timestamps.has(message.author.id)) {
    const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

    if (now < expirationTime) {
        const timeLeft = (expirationTime - now) / 1000;
        return message.reply({ content: `Please wait ${timeLeft.toFixed(1)} seconds for \`${command.name}\` command.`, allowedMentions: { repliedUser: false }});
    }// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
}// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...
let timeout = (e) => setTimeout(() => { e.delete(); }, 5000);
let embeds = new Discord.MessageEmbed().setFooter({ text: client.users.cache.get(config.ayarlar.botowner).tag, iconURL: client.users.cache.get(config.ayarlar.botowner).avatarURL({dynamic: true})}).setAuthor({ name: message.member.displayName, iconURL: message.author.avatarURL({dynamic: true})}).setTimestamp()
timestamps.set(message.author.id, now);
setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
try {
    command.execute(client, message, args, embeds, timeout);
} catch (error) {
    console.error(error);
    message.reply('An error occurred while trying to execute this command!');
}

}
// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...