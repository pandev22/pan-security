const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'ban',
  description: 'Bannit un membre du serveur',
  execute(message, args) {
    if (!message.member.hasPermission('BAN_MEMBERS')) {
      return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member) {
      return message.reply('Veuillez mentionner un membre à bannir.');
    }

    if (!reason) {
      return message.reply('Veuillez fournir une raison pour le ban.');
    }

    const banEmbed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Membre banni')
      .addField('Membre', member.user.tag)
      .addField('Modérateur', message.author.tag)
      .addField('Raison', reason)
      .addField('Date et heure du ban', new Date().toLocaleString('fr-FR'))
      .setTimestamp();

    member.ban({ reason })
      .then(() => {
        message.channel.send(banEmbed);
        const banDetails = {
          bannedMember: member.user.tag,
          moderator: message.author.tag,
          reason: reason,
          timestamp: new Date().toLocaleString('fr-FR')
        };
        let bans = loadBans();
        if (!Array.isArray(bans)) {
          bans = [];
        }
        bans.push(banDetails);
        saveBans(bans);
      })
      .catch(error => {
        console.error(error);
        message.reply('Une erreur est survenue lors du bannissement du membre.');
      });
  },
};

function loadBans() {
  try {
    const bansData = fs.readFileSync('./assets/casier.json', 'utf-8');
    return JSON.parse(bansData);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveBans(bans) {
  try {
    const bansData = JSON.stringify(bans, null, 2);
    fs.writeFileSync('./assets/casier.json', bansData, 'utf-8');
  } catch (error) {
    console.error(error);
  }
}
