require("dotenv").config();

module.exports = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.CLIENT_ID,
  guildId: process.env.GUILD_ID,
  welcomeChannelId: process.env.WELCOME_CHANNEL_ID,
  goodbyeChannelId: process.env.GOODBYE_CHANNEL_ID,
  modLogChannelId: process.env.MOD_LOG_CHANNEL_ID || process.env.LOG_CHANNEL_ID,
  ticketCategoryId: process.env.TICKET_CATEGORY_ID,
  ticketSupportRoleId: process.env.TICKET_SUPPORT_ROLE_ID,
  minecraftHost: process.env.MINECRAFT_HOST,
  minecraftPort: Number(process.env.MINECRAFT_PORT || 25565)
};
