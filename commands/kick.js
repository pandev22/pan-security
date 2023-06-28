const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'kick',
  description: 'Expulse un membre du serveur',
  execute(message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member) {
      return message.reply('Veuillez mentionner un membre à kicker.');
    }

    if (!reason) {
      return message.reply('Veuillez fournir une raison pour le kick.');
    }

    const kickEmbed = new Discord.MessageEmbed()
      .setColor('#FF0000')
      .setTitle('Membre kické')
      .addField('Membre', member.user.tag)
      .addField('Modérateur', message.author.tag)
      .addField('Raison', reason)
      .addField('Date et heure du kick', new Date().toLocaleString('fr-FR'))
      .setTimestamp();

    member.kick(reason)
      .then(() => {
        message.channel.send(kickEmbed);
        const kickDetails = {
          kickedMember: member.user.tag,
          moderator: message.author.tag,
          reason: reason,
          timestamp: new Date().toLocaleString('fr-FR')
        };
        const kicks = loadKicks();
        kicks.push(kickDetails);
        saveKicks(kicks);
      })
      .catch(error => {
        console.error(error);
        message.reply('Une erreur est survenue lors du kick du membre.');
      });
  },
};

function loadKicks() {
  try {
    const kicksData = fs.readFileSync('./assets/casier.json', 'utf-8');
    return JSON.parse(kicksData);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveKicks(kicks) {
  try {
    const kicksData = JSON.stringify(kicks, null, 2);
    fs.writeFileSync('./assets/casier.json', kicksData, 'utf-8');
  } catch (error) {
    console.error(error);
  }
}
