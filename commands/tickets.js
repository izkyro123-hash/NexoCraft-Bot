const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = [
  new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Publica el panel para abrir tickets.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
  new SlashCommandBuilder()
    .setName("ticket-setup")
    .setDescription("Configura y publica el panel de tickets.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
].map(command => command.toJSON());
