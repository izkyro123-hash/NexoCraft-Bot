const { EmbedBuilder } = require("discord.js");

async function sendLog(guild, config, title, description, color = 0x5865f2) {
  if (!config.modLogChannelId) return;
  const channel = guild.channels.cache.get(config.modLogChannelId);
  if (!channel?.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => {});
}

module.exports = { sendLog };
