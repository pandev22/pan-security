const Discord = require('discord.js');

module.exports = {
  name: 'ui',
  description: 'Affiche les informations sur un utilisateur',
  execute(message, args) {
    const user = message.mentions.users.first() || message.author;
    const member = message.guild.member(user);

    const embed = new Discord.MessageEmbed()
      .setColor('#00FF00')
      .setThumbnail(user.displayAvatarURL({ dynamic: true }))
      .addField('Nom', user.username, true)
      .addField('Tag', `#${user.discriminator}`, true)
      .addField('ID', user.id)
      .addField('Info', user.presence.status)
      .addField('Rejoint le serveur', member.joinedAt.toLocaleDateString('fr-FR'), true)
      .addField('A rejoint Discord', user.createdAt.toLocaleDateString('fr-FR'), true)
      .addField('Rôles', member.roles.cache.map(role => role.name).join(', '))
      .addField('Status', user.presence.activities.filter(activity => activity.type === 'PLAYING').map(activity => activity.name).join('\n') || 'Aucun')
      .addField('Nom du serveur', message.guild.name)
      .setTimestamp();

    message.channel.send(embed);
  },
};
