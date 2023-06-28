const Discord = require('discord.js');

module.exports = {
  name: 'unlock',
  description: 'Déverrouille le salon',
  execute(message, args) {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) {
      return message.reply('Vous n\'avez pas la permission de déverrouiller des salons.');
    }

    const channel = message.channel;

    // Vérifie si le salon est déjà déverrouillé
    if (!channel.permissionsFor(channel.guild.roles.everyone).has('SEND_MESSAGES')) {
      // Déverrouille le salon en rétablissant la permission d'envoi de messages
      channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: true })
        .then(() => {
          const embed = new Discord.MessageEmbed()
            .setColor('#00FF00')
            .setTitle('Salon déverrouillé')
            .setDescription(`Le salon ${channel} a été déverrouillé. Les membres peuvent maintenant envoyer des messages.`)
            .addField('Modérateur', message.author.tag)
            .addField('Date et heure', new Date().toLocaleString('fr-FR'))
            .setTimestamp();

          message.channel.send(embed);
        })
        .catch(error => {
          console.error(error);
          message.reply('Une erreur est survenue lors de la tentative de déverrouillage du salon.');
        });
    } else {
      message.reply('Le salon est déjà déverrouillé.');
    }
  },
};
