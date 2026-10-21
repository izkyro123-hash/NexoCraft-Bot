const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ChannelType
} = require("discord.js");
const { sendLog } = require("../utils/logger");
const { getGuildConfig, setGuildConfig } = require("../utils/guildConfig");

module.exports = async function handleInteraction(interaction, context) {
  const { client, config, handlers } = context;
  const guildConfig = interaction.guild ? getGuildConfig(interaction.guild.id, config) : config;

  if (interaction.isChatInputCommand()) {
    if (interaction.commandName === "configurar") {
      const patch = {};
      const welcome = interaction.options.getChannel("bienvenida");
      const goodbye = interaction.options.getChannel("despedidas");
      const logs = interaction.options.getChannel("logs");
      const category = interaction.options.getChannel("categoria_tickets");
      const support = interaction.options.getRole("rol_soporte");
      if (welcome) patch.welcomeChannelId = welcome.id;
      if (goodbye) patch.goodbyeChannelId = goodbye.id;
      if (logs) patch.modLogChannelId = logs.id;
      if (category) patch.ticketCategoryId = category.id;
      if (support) patch.ticketSupportRoleId = support.id;
      if (!Object.keys(patch).length) return interaction.reply({ content: "Selecciona al menos una opción para guardar. Las opciones omitidas no cambian.", ephemeral: true });
      setGuildConfig(interaction.guildId, patch);
      return interaction.reply({ content: "✅ Configuración guardada para **" + interaction.guild.name + "**. Cada servidor tiene su propia configuración.", ephemeral: true });
    }

    if (interaction.commandName === "configuracion") {
      const c = getGuildConfig(interaction.guildId, config);
      return interaction.reply({ content: [
        "**⚙️ Configuración de este servidor**",
        "Bienvenida: " + (c.welcomeChannelId ? "<#" + c.welcomeChannelId + ">" : "No configurado"),
        "Despedidas: " + (c.goodbyeChannelId ? "<#" + c.goodbyeChannelId + ">" : "No configurado"),
        "Logs: " + (c.modLogChannelId ? "<#" + c.modLogChannelId + ">" : "No configurado"),
        "Categoría de tickets: " + (c.ticketCategoryId ? "<#" + c.ticketCategoryId + ">" : "No configurado"),
        "Rol de soporte: " + (c.ticketSupportRoleId ? "<@&" + c.ticketSupportRoleId + ">" : "No configurado")
      ].join("\\n"), ephemeral: true });
    }

    const handler = handlers[interaction.commandName];
    if (handler) return handler(interaction, client, config);

    if (interaction.commandName === "ban") {
      const user = interaction.options.getUser("usuario", true);
      const reason = interaction.options.getString("razon") || "Sin razón especificada";
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) return interaction.reply({ content: "❌ No encontré a ese miembro.", ephemeral: true });
      if (!member.bannable) return interaction.reply({ content: "❌ No puedo banear a ese usuario. Revisa la jerarquía.", ephemeral: true });
      await member.ban({ reason });
      await interaction.reply(`🔨 **${user.tag}** fue baneado. Razón: **${reason}**`);
      return sendLog(interaction.guild, guildConfig, "🔨 Usuario baneado", `**Usuario:** ${user.tag} (${user.id})\n**Moderador:** ${interaction.user.tag}\n**Razón:** ${reason}`, 0xed4245);
    }

    if (interaction.commandName === "kick") {
      const user = interaction.options.getUser("usuario", true);
      const reason = interaction.options.getString("razon") || "Sin razón especificada";
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) return interaction.reply({ content: "❌ No encontré a ese miembro.", ephemeral: true });
      if (!member.kickable) return interaction.reply({ content: "❌ No puedo expulsar a ese usuario. Revisa la jerarquía.", ephemeral: true });
      await member.kick(reason);
      await interaction.reply(`👢 **${user.tag}** fue expulsado. Razón: **${reason}**`);
      return sendLog(interaction.guild, config, "👢 Usuario expulsado", `**Usuario:** ${user.tag} (${user.id})\n**Moderador:** ${interaction.user.tag}\n**Razón:** ${reason}`, 0xed4245);
    }

    if (interaction.commandName === "timeout") {
      const user = interaction.options.getUser("usuario", true);
      const minutes = interaction.options.getInteger("minutos", true);
      const reason = interaction.options.getString("razon") || "Sin razón especificada";
      const member = await interaction.guild.members.fetch(user.id).catch(() => null);
      if (!member) return interaction.reply({ content: "❌ No encontré a ese miembro.", ephemeral: true });
      if (!member.moderatable) return interaction.reply({ content: "❌ No puedo aplicar timeout a ese usuario.", ephemeral: true });
      await member.timeout(minutes * 60 * 1000, reason);
      await interaction.reply(`⏳ **${user.tag}** recibió timeout durante **${minutes} minutos**.`);
      return sendLog(interaction.guild, config, "⏳ Timeout aplicado", `**Usuario:** ${user.tag}\n**Moderador:** ${interaction.user.tag}\n**Duración:** ${minutes} min\n**Razón:** ${reason}`, 0xfee75c);
    }

    if (interaction.commandName === "clear") {
      const amount = interaction.options.getInteger("cantidad", true);
      await interaction.deferReply({ ephemeral: true });
      const deleted = await interaction.channel.bulkDelete(amount, true);
      await interaction.editReply(`🧹 Eliminados **${deleted.size}** mensajes.`);
      return sendLog(interaction.guild, config, "🧹 Mensajes eliminados", `**Moderador:** ${interaction.user.tag}\n**Cantidad:** ${deleted.size}`, 0xfee75c);
    }

    if (interaction.commandName === "ticket-panel") {
      const embed = new EmbedBuilder()
        .setTitle("🎫 Soporte NexoCraft")
        .setDescription("Pulsa el botón para abrir un ticket privado con el equipo de soporte.")
        .setColor(0x5865f2);

      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("ticket:create")
          .setLabel("Abrir ticket")
          .setEmoji("🎫")
          .setStyle(ButtonStyle.Primary)
      );

      return interaction.reply({ embeds: [embed], components: [row] });
    }
  }

  if (!interaction.isButton()) return;

  if (interaction.customId === "ticket:create") {
    const guild = interaction.guild;
    const category = config.ticketCategoryId ? guild.channels.cache.get(config.ticketCategoryId) : null;
    const supportRole = config.ticketSupportRoleId || null;

    const existing = guild.channels.cache.find(
      c => c.type === ChannelType.GuildText && c.topic === `ticket-owner:${interaction.user.id}`
    );
    if (existing) {
      return interaction.reply({ content: `❌ Ya tienes un ticket abierto: ${existing}`, ephemeral: true });
    }

    const safeName = interaction.user.username.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60) || "usuario";

    const permissionOverwrites = [
      { id: guild.roles.everyone.id, deny: ["ViewChannel"] },
      { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
    ];

    if (supportRole) {
      permissionOverwrites.push({
        id: supportRole,
        allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"]
      });
    }

    const channel = await guild.channels.create({
      name: `ticket-${safeName}`,
      type: ChannelType.GuildText,
      parent: category?.id,
      topic: `ticket-owner:${interaction.user.id}`,
      permissionOverwrites
    });

    const closeRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setCustomId("ticket:close")
        .setLabel("Cerrar ticket")
        .setEmoji("🔒")
        .setStyle(ButtonStyle.Danger)
    );

    await channel.send({
      content: `<@${interaction.user.id}>${supportRole ? ` <@&${supportRole}>` : ""}`,
      embeds: [
        new EmbedBuilder()
          .setTitle("🎫 Ticket abierto")
          .setDescription("Explica tu problema con todos los detalles posibles. El equipo te ayudará aquí.")
          .setColor(0x5865f2)
      ],
      components: [closeRow]
    });

    await interaction.reply({ content: `✅ Ticket creado: ${channel}`, ephemeral: true });
    return sendLog(guild, getGuildConfig(guild.id, config), "🎫 Ticket creado", `**Usuario:** ${interaction.user.tag}\n**Canal:** ${channel}`, 0x57f287);
  }

  if (interaction.customId === "ticket:close") {
    const channel = interaction.channel;
    await interaction.reply("🔒 Cerrando ticket en 5 segundos...");
    await sendLog(interaction.guild, getGuildConfig(interaction.guild.id, config), "🔒 Ticket cerrado", `**Canal:** ${channel.name}\n**Cerrado por:** ${interaction.user.tag}`, 0xed4245);
    setTimeout(() => channel.delete("Ticket cerrado").catch(() => {}), 5000);
  }
};
