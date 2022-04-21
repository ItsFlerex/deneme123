const Discord = require("discord.js");
const config = require("../ayarlar.json");
const reg = require("../modules/register.js");
const moment = require("moment");
require("moment-duration-format"); moment.locale("tr");

module.exports = {
    name: 'kız',
    description: '',
    aliases: ['woman', 'k', 'w'],
    usage: "kız @Etiket/ID İsim Yaş",
    cooldown: 5,

    async execute(client, message, args, embeds, timeout) {

        if(!message.member.roles.cache.has(config.staffs.foundar) && !message.member.roles.cache.has(config.staffs.owner) && !message.member.roles.cache.has(config.staffs.register) && !message.member.permissions.has('ADMINISTRATOR') && message.author.id !== config.ayarlar.botowner) return message.react(config.emojis.red);
        let user = message.mentions.members.first() || message.guild.members.cache.get([args[0]])
        if(!user) return message.reply({embeds : [embeds.setDescription("Geçerli bir kişi belirlemelisin!")]}).then(timeout).catch(e => { });
        let tag = config.ayarlar.tag;
        let nick = args[1];
        let age = args[2];
        if(!nick) return message.reply({embeds: [embeds.setDescription("Geçerli bir isim belirlemelisin!")]}).then(timeout).catch(e => { });
        if(isNaN(age)) return message.reply({embeds: [embeds.setDescription("Geçerli bir yaş belirlemelisin!")]}).then(timeout).catch(e => { });
        if(config.roles.woman && config.roles.woman.some(rol => user.roles.cache.has(rol))) return message.channel.send({ embeds: [embeds.setDescription("Bu kişi zaten kayıtlı.")]}).then(timeout).catch(e => { })
        await user.setNickname(`${tag} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()}${age ? ` ${config.ayarlar.nametag} ${age}` : ``}`).catch(e => { });
        await user.roles.add(config.roles.woman).catch(e => { });
        await user.roles.remove(config.roles.unreg).catch(e => { });
        await user.roles.remove(config.roles.man).catch(e => { });

        let regData = await reg.findOne({ guildID: message.guild.id, userID: user.id});
        let staffData = await reg.findOne({ guildID: message.guild.id, userID: message.author.id});
        if(!staffData) {
            let newStaffData = new reg({
                guildID: message.guild.id,
                userID: message.author.id,
                totalReg: 1,
                womanReg: 1,
                manReg: 0,
                userNames: []
            }).save()
        } else {
            staffData.totalReg++
            staffData.womanReg++
        }
        if(!regData) {
            let newRegData = new reg({
                guildID: message.guild.id,
                userID: user.id,
                totalReg: 0,
                womanReg: 0,
                manReg: 0,
                userNames: [{ nick: `${tag} ${age} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()}${age ? ` ${config.ayarlar.nametag} ${age}` : ``}`, type: `KIZ`}]
            }).save();
        } else {
            regData.userNames.push[{ nick: `${tag} ${age} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()}${age ? ` ${config.ayarlar.nametag} ${age}` : ``}`, type: `KIZ`}]
            regData.save();
        }

        message.reply({ embeds: [embeds.setDescription(`${user}, adlı kişi \`KIZ\` olarak aramıza katıldı.`)]}).catch(e => { });
        client.channels.cache.get(config.logs.woman).send({ embeds: [embeds.setDescription(`Kayıt Eden: ${message.author} - (\`${message.author.id}\`) \nKayıt Olan: ${user} - (\`${user.id}\`) \nKayıt Olma Tarihi: \`${moment(Date.now()).format("LLL")}\` \nVerilen Roller: ${config.roles.woman(x => `<@&${x}>`)} \nYeni İsmi: \`${tag} ${age} ${nick.charAt(0).toUpperCase() + nick.slice(1).toLowerCase()}${age ? ` ${config.ayarlar.nametag} ${age}` : ``}\``)]}).catch(e => { });
        client.channels.cache.get(config.logs.chat).send(`${user} aramıza katıldı.`).catch(e => { });
    },
};

// Erdem Çakıroğlu Tarafından Yapılıp Sizler İçin Paylaşılmıştır ...