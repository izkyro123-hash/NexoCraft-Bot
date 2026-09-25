const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = [
  new SlashCommandBuilder().setName("help").setDescription("Muestra la ayuda de NexoCraft."),
  new SlashCommandBuilder().setName("ping").setDescription("Muestra la latencia del bot."),
  new SlashCommandBuilder().setName("serverinfo").setDescription("Muestra información del servidor."),
  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información de un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a consultar.").setRequired(false))
].map(command => command.toJSON());

module.exports.handlers = {
  async help(interaction) {
    const embed = new EmbedBuilder()
      .setTitle("📚 NexoCraft • Ayuda")
      .setDescription([
        "**General**",
        "`/help` • Ayuda",
        "`/ping` • Latencia",
        "`/serverinfo` • Información del servidor",
        "`/userinfo` • Información de usuario",
        "",
        "**Moderación**",
        "`/ban` • Baneo",
        "`/kick` • Expulsión",
        "`/timeout` • Timeout",
        "`/clear` • Limpiar mensajes",
        "",
        "**Soporte**",
        "`/ticket-panel` • Panel de tickets"
      ].join("\n"))
      .setColor(0x5865f2);
    return interaction.reply({ embeds: [embed] });
  },

  async ping(interaction, client) {
    return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
  },

  async serverinfo(interaction) {
    const guild = interaction.guild;
    const embed = new EmbedBuilder()
      .setTitle(`🛡️ ${guild.name}`)
      .addFields(
        { name: "👑 Dueño", value: `<@${guild.ownerId}>`, inline: true },
        { name: "👥 Miembros", value: String(guild.memberCount), inline: true },
        { name: "💬 Canales", value: String(guild.channels.cache.size), inline: true }
      )
      .setThumbnail(guild.iconURL({ extension: "png", size: 256 }) || null)
      .setColor(0x5865f2);
    return interaction.reply({ embeds: [embed] });
  },

  async userinfo(interaction) {
    const user = interaction.options.getUser("usuario") || interaction.user;
    const member = interaction.guild.members.cache.get(user.id);
    const embed = new EmbedBuilder()
      .setTitle(`👤 ${user.tag}`)
      .setThumbnail(user.displayAvatarURL({ extension: "png", size: 256 }))
      .addFields(
        { name: "ID", value: user.id, inline: true },
        { name: "Cuenta creada", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
        { name: "Entró al servidor", value: member?.joinedTimestamp ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "No disponible", inline: true }
      )
      .setColor(0x5865f2);
    return interaction.reply({ embeds: [embed] });
  }
};
