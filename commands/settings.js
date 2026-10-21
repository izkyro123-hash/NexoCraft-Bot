const { SlashCommandBuilder, PermissionFlagsBits, ChannelType } = require("discord.js");

const configure = new SlashCommandBuilder()
  .setName("configurar")
  .setDescription("Configura bienvenida, logs y tickets para este servidor.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
  .addChannelOption(o => o.setName("bienvenida").setDescription("Canal de bienvenida (opcional).").addChannelTypes(ChannelType.GuildText).setRequired(false))
  .addChannelOption(o => o.setName("despedidas").setDescription("Canal de despedidas (opcional).").addChannelTypes(ChannelType.GuildText).setRequired(false))
  .addChannelOption(o => o.setName("logs").setDescription("Canal para logs de moderación y tickets (opcional).").addChannelTypes(ChannelType.GuildText).setRequired(false))
  .addChannelOption(o => o.setName("categoria_tickets").setDescription("Categoría donde se crearán los tickets (opcional).").addChannelTypes(ChannelType.GuildCategory).setRequired(false))
  .addRoleOption(o => o.setName("rol_soporte").setDescription("Rol que podrá ver los tickets (opcional).").setRequired(false));

const show = new SlashCommandBuilder()
  .setName("configuracion")
  .setDescription("Muestra la configuración de este servidor.")
  .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild);

module.exports = [configure.toJSON(), show.toJSON()];
