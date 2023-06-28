const Discord = require('discord.js');

module.exports = {
  name: 'ping',
  description: 'Répond avec Pong!',
  execute(message, args) {
    const embed = new Discord.MessageEmbed()
      .setColor('#0099ff')
      .setTitle('Pong!')
      .setDescription('Le bot répond !')
      .setTimestamp();

    message.channel.send(embed);
    message.delete()
  },
};
