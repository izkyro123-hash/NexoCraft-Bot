const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = [
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a banear.").setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Razón.").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a expulsar.").setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Razón.").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Aplica timeout.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario.").setRequired(true))
    .addIntegerOption(o => o.setName("minutos").setDescription("Duración en minutos.").setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Razón.").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Elimina mensajes.")
    .addIntegerOption(o => o.setName("cantidad").setDescription("Cantidad entre 1 y 100.").setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
].map(command => command.toJSON());
