require("dotenv").config();

const { Client, GatewayIntentBits } = require("discord.js");
const config = require("./config/config");
const general = require("./commands/general");
const moderation = require("./commands/moderation");
const tickets = require("./commands/tickets");
const ready = require("./events/ready");
const memberEvents = require("./events/member");
const handleInteraction = require("./events/interactions");

if (!config.token || !config.clientId || !config.guildId) {
  console.error("❌ Faltan DISCORD_TOKEN, CLIENT_ID o GUILD_ID.");
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers]
});

const commandData = [...general, ...moderation, ...tickets];
const handlers = general.handlers;

client.once("ready", async () => {
  try {
    await ready(client, config, commandData);
  } catch (error) {
    console.error("❌ Error registrando comandos:", error);
  }
});

client.on("guildMemberAdd", member => memberEvents.welcome(member, config));
client.on("guildMemberRemove", member => memberEvents.goodbye(member, config));

client.on("interactionCreate", interaction =>
  handleInteraction(interaction, { client, config, handlers }).catch(async error => {
    console.error("❌ Error en interacción:", error);
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({
        content: "❌ Ocurrió un error al ejecutar esta acción.",
        ephemeral: true
      }).catch(() => {});
    }
  })
);

client.login(config.token).catch(error => {
  console.error("❌ No se pudo iniciar sesión en Discord:", error);
  process.exit(1);
});
