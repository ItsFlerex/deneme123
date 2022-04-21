const Discord = require("discord.js");
const config = require("../ayarlar.json");
const reg = require("../modules/register.js");
const moment = require("moment");
require("moment-duration-format"); moment.locale("tr");

module.exports = {
    name: "isimler",
    description: "",
    aliases: ["nicks", "iler", "ns"],
    usage: "İsim geçmişlerine bakarsınız.",
    cooldown: 5,

    async execute(client, message, args, embeds, timeout) {
        if (!message.member.roles.cache.has(config.staffs.foundar) && !message.member.roles.cache.has(config.staffs.owner) && !message.member.roles.cache.has(config.staffs.register) && !message.member.permissions.has('ADMINISTRATOR') && message.author.id !== config.ayarlar.botowner) return message.react(config.emojis.red);
        let user = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
        let data = await reg.findOne({ guildID: message.guild.id, userID: user.id })
        if (!data || data && !data.userNames.length) return message.reply({ embeds: [embeds.setDescription(`${user} Kişinin geçmişe kayıtlı herhangi gibi bir isim bulunmuyor.`)] });

        embeds.setDescription(`${user} adlı kişinin  \`${data.userNames ? data.userNames.length : 0}\` geçmiş ismi bulundu. \n\n${data.userNames.map((a, i) => `\`${i + 1}.\` \`${a.nick}\` [**${a.type.replace(`Erkek`, `<@&${config.roles.man[0]}>`).replace(`Kız`, `<@&${config.roles.woman}>`)}**]`).join("\n")}`);
        message.reply({ embeds: [embeds] });
    },
}

// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...