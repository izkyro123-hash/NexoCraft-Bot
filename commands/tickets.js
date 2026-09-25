const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = [
  new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Publica el panel para abrir tickets.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
].map(command => command.toJSON());
