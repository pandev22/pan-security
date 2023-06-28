const fs = require('fs');
const Discord = require('discord.js');
const config = require('./config.json');
const badWords = ['gros mot 1', 'gros mot 2', 'gros mot 3']; // Remplacez par votre liste de gros mots

const client = new Discord.Client();
client.commands = new Discord.Collection();

// Chargement des commandes
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
}

client.on('ready', () => {
  console.log(`Connecté en tant que ${client.user.tag}`);
  updateStatus();
  setInterval(updateStatus, 60000); // Mettre à jour le statut toutes les 60 secondes
});

client.on('message', message => {
  if (!message.content.startsWith(config.prefix) || message.author.bot) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command = client.commands.get(commandName);

  if (!command) return;

  try {
    command.execute(message, args);
  } catch (error) {
    console.error(error);
    message.reply('Une erreur s\'est produite lors de l\'exécution de la commande.');
  }
});

client.on('message', message => {
    if (message.author.bot) return;
  
    const content = message.content.toLowerCase();
  
    // Vérifier si le message contient un gros mot
    const hasBadWord = badWords.some(word => content.includes(word.toLowerCase()));
  
    if (hasBadWord) {
      // Supprimer le message contenant le gros mot
      message.delete();
  
      // Envoyer un message privé à l'utilisateur
      const embed = new Discord.MessageEmbed()
        .setColor('#FF0000')
        .setTitle('Avertissement')
        .setDescription(`Veuillez éviter d'utiliser des gros mots sur le serveur ${message.guild.name}.`)
        .setTimestamp();
  
      message.author.send(embed)
        .catch(console.error);
    }
});

// Tableau des statuts personnalisés
const statuses = [
  { type: 'PLAYING', message: 'dev' },
  { type: 'WATCHING', message: '{memberCount} membres' },
  { type: 'LISTENING', message: 'J\'écoute vos commandes' },
  { type: 'STREAMING', message: 'les dev super cool' },
];

// Fonction pour mettre à jour le statut du bot
function updateStatus() {
  const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
  const formattedMessage = randomStatus.message
    .replace('{serverCount}', client.guilds.cache.size)
    .replace('{memberCount}', client.users.cache.size);

  client.user.setActivity(formattedMessage, { type: randomStatus.type });
}

client.login(config.token);
