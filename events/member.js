const { EmbedBuilder } = require("discord.js");

module.exports = {
  async welcome(member, config) {
    if (!config.welcomeChannelId) return;
    const channel = member.guild.channels.cache.get(config.welcomeChannelId);
    if (!channel?.isTextBased()) return;

    const embed = new EmbedBuilder()
      .setTitle("👋 ¡Bienvenido a NexoCraft!")
      .setDescription(`¡Hola ${member}! Bienvenido/a a **${member.guild.name}**.\n\nLee las reglas y disfruta de la comunidad.`)
      .setThumbnail(member.user.displayAvatarURL({ extension: "png", size: 256 }))
      .setColor(0x57f287)
      .setTimestamp();

    await channel.send({ embeds: [embed] }).catch(() => {});
  },

  async goodbye(member, config) {
    const channelId = config.goodbyeChannelId || config.welcomeChannelId;
    if (!channelId) return;
    const channel = member.guild.channels.cache.get(channelId);
    if (!channel?.isTextBased()) return;
    await channel.send(`👋 **${member.user?.tag || "Un usuario"}** salió de NexoCraft.`).catch(() => {});
  }
};
