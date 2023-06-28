const Discord = require('discord.js');

const captchaChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789#$%^&()@_+{}"|><?~`';

function generateCaptcha() {
  let captcha = '';
  for (let i = 0; i < 6; i++) {
    captcha += captchaChars.charAt(Math.floor(Math.random() * captchaChars.length));
  }
  return captcha;
}

module.exports = {
  name: 'captcha',
  description: 'Génère un captcha pour vérification',
  async execute(message, args) {
    const verifiedRoleName = 'valider';
    const verifiedRole = message.guild.roles.cache.find(role => role.name === verifiedRoleName);

    if (!verifiedRole) {
      return message.channel.send('Le rôle de vérification n\'existe pas. Veuillez contacter un administrateur.');
    }

    if (message.member.roles.cache.some(role => role.name === verifiedRoleName)) {
      return message.author.send('Vous avez déjà été vérifié et avez le rôle correspondant.');
    }

    const captcha = generateCaptcha();

    const embed = new Discord.MessageEmbed()
      .setTitle('Vérification Captcha')
      .setDescription(`Veuillez saisir le code suivant : **${captcha}**`)
      .setColor('#00FF00');

    const filter = m => m.author.id === message.author.id;
    try {
      const dmChannel = await message.author.createDM();
      await dmChannel.send(embed);

      const userResponse = await dmChannel.awaitMessages(filter, { max: 1, time: 30000, errors: ['time'] });
      const response = userResponse.first().content;

      if (response === captcha) {
        await message.member.roles.add(verifiedRole);
        message.author.send('Captcha valide ! Vous avez été vérifié avec succès. Le rôle vous a été attribué.');
      } else {
        message.author.send('Captcha invalide ! Veuillez réessayer.');
      }
    } catch (error) {
      message.channel.send('La vérification du captcha a expiré. Veuillez réessayer.');
    } finally {
      message.delete().catch(console.error);
    }
  },
};
