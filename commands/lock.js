const Discord = require('discord.js');

module.exports = {
  name: 'lock',
  description: 'Verrouille le salon',
  execute(message, args) {
    if (!message.member.hasPermission('MANAGE_CHANNELS')) {
      return message.reply('Vous n\'avez pas la permission de verrouiller des salons.');
    }

    const channel = message.channel;

    // Vérifie si le salon est déjà verrouillé
    if (channel.permissionsFor(channel.guild.roles.everyone).has('SEND_MESSAGES')) {
      // Verrouille le salon en enlevant la permission d'envoi de messages
      channel.updateOverwrite(channel.guild.roles.everyone, { SEND_MESSAGES: false })
        .then(() => {
          const embed = new Discord.MessageEmbed()
            .setColor('#FF0000')
            .setTitle('Salon verrouillé')
            .setDescription(`Le salon ${channel} a été verrouillé. Les membres ne peuvent plus envoyer de messages.`)
            .addField('Modérateur', message.author.tag)
            .addField('Date et heure', new Date().toLocaleString('fr-FR'))
            .setTimestamp();

          message.channel.send(embed);
        })
        .catch(error => {
          console.error(error);
          message.reply('Une erreur est survenue lors de la tentative de verrouillage du salon.');
        });
    } else {
      message.reply('Le salon est déjà verrouillé.');
    }
  },
};
