const Discord = require('discord.js');
const fs = require('fs');

module.exports = {
  name: 'warn',
  description: 'Avertit un membre du serveur',
  execute(message, args) {
    if (!message.member.hasPermission('KICK_MEMBERS')) {
      return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.'); // Regarde si la personne et Admin
    }

    const member = message.mentions.members.first();
    const reason = args.slice(1).join(' ');

    if (!member) {
      return message.reply('Veuillez mentionner un membre à avertir.'); // Regarde si un membre et mentioner
    }

    if (!reason) {
      return message.reply('Veuillez fournir une raison pour l\'avertissement.'); // Regarde si une raison et donner
    }

    const warnEmbed = new Discord.MessageEmbed()
      .setColor('#FFC75F')
      .setTitle('Membre averti')
      .addField('Membre', member.user.tag)
      .addField('Modérateur', message.author.tag)
      .addField('Raison', reason)
      .addField('Date et heure du warn', new Date().toLocaleString('fr-FR'))
      .setTimestamp();

    message.channel.send(warnEmbed);
    const warnDetails = {
      warnedMember: member.user.tag,
      moderator: message.author.tag,
      reason: reason,
      timestamp: new Date().toLocaleString('fr-FR')
    };
    const warns = loadWarns();
    warns.push(warnDetails);
    saveWarns(warns);
  },
};

function loadWarns() {
  try {
    const warnsData = fs.readFileSync('./assets/casier.json', 'utf-8');
    return JSON.parse(warnsData);
  } catch (error) {
    console.error(error);
    return [];
  }
}

function saveWarns(warns) {
  try {
    const warnsData = JSON.stringify(warns, null, 2);
    fs.writeFileSync('./assets/casier.json', warnsData, 'utf-8');
  } catch (error) {
    console.error(error);
  }
}
