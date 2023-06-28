const Discord = require('discord.js');

module.exports = {
  name: 'everyone',
  description: 'Ping sans autorisation',
  execute(message, args) {
    if (!message.member.hasPermission('ADMINISTRATOR')) {
      return message.reply('Vous n\'avez pas la permission d\'utiliser cette commande.');
    }

    if (message.mentions.everyone) {
      message.delete(); // Supprime le message avec la mention @everyone

      const kickEmbed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Mention @everyone non autorisée')
        .setDescription('Vous avez utilisé la mention @everyone sans autorisation.')
        .addField('Utilisateur', message.author.tag)
        .addField('Salon', message.channel.name)
        .addField('Date et heure', new Date().toLocaleString('fr-FR'))
        .setTimestamp();

      message.member.kick('Utilisation de la mention @everyone sans autorisation')
        .then(() => {
          message.channel.send(kickEmbed);
        })
        .catch(error => {
          console.error(error);
          message.reply('Une erreur est survenue lors du kick de l\'utilisateur.');
        });
    }
  },
};