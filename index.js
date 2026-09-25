require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Partials,
  REST,
  Routes,
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle
} = require("discord.js");

const required = ["DISCORD_TOKEN", "CLIENT_ID", "GUILD_ID"];
for (const key of required) {
  if (!process.env[key]) {
    console.error(`❌ Falta ${key} en las variables de entorno.`);
    process.exit(1);
  }
}

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers
  ],
  partials: [Partials.GuildMember]
});

const commands = [
  new SlashCommandBuilder().setName("help").setDescription("Muestra los comandos de NexoCraft."),
  new SlashCommandBuilder().setName("ping").setDescription("Muestra la latencia del bot."),
  new SlashCommandBuilder().setName("serverinfo").setDescription("Muestra información del servidor de Discord."),
  new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("Muestra información de un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a consultar.").setRequired(false)),
  new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Banea a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a banear.").setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Razón del baneo.").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
  new SlashCommandBuilder()
    .setName("kick")
    .setDescription("Expulsa a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario a expulsar.").setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Razón.").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers),
  new SlashCommandBuilder()
    .setName("timeout")
    .setDescription("Aplica timeout a un usuario.")
    .addUserOption(o => o.setName("usuario").setDescription("Usuario.").setRequired(true))
    .addIntegerOption(o => o.setName("minutos").setDescription("Duración en minutos.").setMinValue(1).setMaxValue(40320).setRequired(true))
    .addStringOption(o => o.setName("razon").setDescription("Razón.").setRequired(false))
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers),
  new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Elimina mensajes.")
    .addIntegerOption(o => o.setName("cantidad").setDescription("Entre 1 y 100 mensajes.").setMinValue(1).setMaxValue(100).setRequired(true))
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
  new SlashCommandBuilder()
    .setName("ticket-panel")
    .setDescription("Publica el panel para abrir tickets.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild)
].map(c => c.toJSON());

async function registerCommands() {
  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD_TOKEN);
  console.log("🔄 Registrando comandos de NexoCraft...");
  await rest.put(
    Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
    { body: commands }
  );
  console.log(`✅ ${commands.length} comandos registrados correctamente.`);
}

async function sendLog(guild, title, description, color = 0x5865f2) {
  const channelId = process.env.MOD_LOG_CHANNEL_ID || process.env.LOG_CHANNEL_ID;
  if (!channelId) return;
  const channel = guild.channels.cache.get(channelId);
  if (!channel || !channel.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => {});
}

client.once("ready", async () => {
  console.log(`🤖 NexoCraft conectado como ${client.user.tag}`);
  client.user.setActivity("/help • NexoCraft", { type: 0 });

  try {
    await registerCommands();
  } catch (error) {
    console.error("❌ No se pudieron registrar los comandos:", error);
  }
});

client.on("guildMemberAdd", async member => {
  const id = process.env.WELCOME_CHANNEL_ID;
  if (!id) return;
  const channel = member.guild.channels.cache.get(id);
  if (!channel || !channel.isTextBased()) return;

  const embed = new EmbedBuilder()
    .setTitle("👋 ¡Bienvenido a NexoCraft!")
    .setDescription(`¡Hola ${member}! Bienvenido/a a **${member.guild.name}**.\n\nLee las reglas y disfruta de la comunidad.`)
    .setThumbnail(member.user.displayAvatarURL({ extension: "png", size: 256 }))
    .setColor(0x57f287)
    .setTimestamp();

  await channel.send({ embeds: [embed] }).catch(() => {});
});

client.on("guildMemberRemove", async member => {
  const id = process.env.GOODBYE_CHANNEL_ID || process.env.WELCOME_CHANNEL_ID;
  if (!id) return;
  const channel = member.guild.channels.cache.get(id);
  if (!channel || !channel.isTextBased()) return;
  await channel.send(`👋 **${member.user?.tag || "Un usuario"}** salió de NexoCraft.`).catch(() => {});
});

client.on("interactionCreate", async interaction => {
  try {
    if (interaction.isChatInputCommand()) {
      const { commandName } = interaction;

      if (commandName === "help") {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setTitle("📚 NexoCraft • Ayuda")
              .setDescription([
                "**General**",
                "`/help` • Lista de comandos",
                "`/ping` • Latencia",
                "`/serverinfo` • Información del servidor",
                "`/userinfo` • Información de un usuario",
                "",
                "**Moderación**",
                "`/ban` • Baneo",
                "`/kick` • Expulsión",
                "`/timeout` • Silenciar temporalmente",
                "`/clear` • Limpiar mensajes",
                "",
                "**Soporte**",
                "`/ticket-panel` • Crear panel de tickets"
              ].join("\n"))
              .setColor(0x5865f2)
          ]
        });
      }

      if (commandName === "ping") {
        return interaction.reply(`🏓 Pong! ${client.ws.ping}ms`);
      }

      if (commandName === "serverinfo") {
        const g = interaction.guild;
        const embed = new EmbedBuilder()
          .setTitle(`🛡️ ${g.name}`)
          .addFields(
            { name: "👑 Dueño", value: `<@${g.ownerId}>`, inline: true },
            { name: "👥 Miembros", value: String(g.memberCount), inline: true },
            { name: "💬 Canales", value: String(g.channels.cache.size), inline: true }
          )
          .setThumbnail(g.iconURL({ extension: "png", size: 256 }) || null)
          .setColor(0x5865f2);
        return interaction.reply({ embeds: [embed] });
      }

      if (commandName === "userinfo") {
        const user = interaction.options.getUser("usuario") || interaction.user;
        const member = interaction.guild.members.cache.get(user.id);
        const embed = new EmbedBuilder()
          .setTitle(`👤 ${user.tag}`)
          .setThumbnail(user.displayAvatarURL({ extension: "png", size: 256 }))
          .addFields(
            { name: "ID", value: user.id, inline: true },
            { name: "Cuenta creada", value: `<t:${Math.floor(user.createdTimestamp / 1000)}:R>`, inline: true },
            { name: "Entró al servidor", value: member ? `<t:${Math.floor(member.joinedTimestamp / 1000)}:R>` : "No disponible", inline: true }
          )
          .setColor(0x5865f2);
        return interaction.reply({ embeds: [embed] });
      }

      if (commandName === "ban") {
        const user = interaction.options.getUser("usuario", true);
        const reason = interaction.options.getString("razon") || "Sin razón especificada";
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) return interaction.reply({ content: "❌ No encontré a ese miembro en el servidor.", ephemeral: true });
        if (!member.bannable) return interaction.reply({ content: "❌ No puedo banear a ese usuario. Revisa la jerarquía de roles y permisos.", ephemeral: true });

        await member.ban({ reason });
        await interaction.reply(`🔨 **${user.tag}** fue baneado. Razón: **${reason}**`);
        await sendLog(interaction.guild, "🔨 Usuario baneado", `**Usuario:** ${user.tag} (${user.id})\n**Moderador:** ${interaction.user.tag}\n**Razón:** ${reason}`, 0xed4245);
        return;
      }

      if (commandName === "kick") {
        const user = interaction.options.getUser("usuario", true);
        const reason = interaction.options.getString("razon") || "Sin razón especificada";
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) return interaction.reply({ content: "❌ No encontré a ese miembro.", ephemeral: true });
        if (!member.kickable) return interaction.reply({ content: "❌ No puedo expulsar a ese usuario. Revisa los permisos y la jerarquía.", ephemeral: true });

        await member.kick(reason);
        await interaction.reply(`👢 **${user.tag}** fue expulsado. Razón: **${reason}**`);
        await sendLog(interaction.guild, "👢 Usuario expulsado", `**Usuario:** ${user.tag} (${user.id})\n**Moderador:** ${interaction.user.tag}\n**Razón:** ${reason}`, 0xed4245);
        return;
      }

      if (commandName === "timeout") {
        const user = interaction.options.getUser("usuario", true);
        const minutes = interaction.options.getInteger("minutos", true);
        const reason = interaction.options.getString("razon") || "Sin razón especificada";
        const member = await interaction.guild.members.fetch(user.id).catch(() => null);
        if (!member) return interaction.reply({ content: "❌ No encontré a ese miembro.", ephemeral: true });
        if (!member.moderatable) return interaction.reply({ content: "❌ No puedo aplicar timeout a ese usuario.", ephemeral: true });

        await member.timeout(minutes * 60 * 1000, reason);
        await interaction.reply(`⏳ **${user.tag}** recibió timeout durante **${minutes} minutos**. Razón: **${reason}**`);
        await sendLog(interaction.guild, "⏳ Timeout aplicado", `**Usuario:** ${user.tag}\n**Moderador:** ${interaction.user.tag}\n**Duración:** ${minutes} min\n**Razón:** ${reason}`, 0xfee75c);
        return;
      }

      if (commandName === "clear") {
        const amount = interaction.options.getInteger("cantidad", true);
        await interaction.deferReply({ ephemeral: true });
        const deleted = await interaction.channel.bulkDelete(amount, true);
        await interaction.editReply(`🧹 Eliminados **${deleted.size}** mensajes.`);
        await sendLog(interaction.guild, "🧹 Mensajes eliminados", `**Moderador:** ${interaction.user.tag}\n**Cantidad:** ${deleted.size}`, 0xfee75c);
        return;
      }

      if (commandName === "ticket-panel") {
        const embed = new EmbedBuilder()
          .setTitle("🎫 Soporte NexoCraft")
          .setDescription("¿Necesitas ayuda? Pulsa el botón de abajo para abrir un ticket privado con el equipo de soporte.")
          .setColor(0x5865f2);

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("ticket:create").setLabel("Abrir ticket").setEmoji("🎫").setStyle(ButtonStyle.Primary)
        );

        return interaction.reply({ embeds: [embed], components: [row] });
      }
    }

    if (interaction.isButton()) {
      if (interaction.customId === "ticket:create") {
        const guild = interaction.guild;
        const category = process.env.TICKET_CATEGORY_ID
          ? guild.channels.cache.get(process.env.TICKET_CATEGORY_ID)
          : null;

        const supportRole = process.env.TICKET_SUPPORT_ROLE_ID || null;
        const existing = guild.channels.cache.find(c => c.type === ChannelType.GuildText && c.name === `ticket-${interaction.user.id}`);
        if (existing) return interaction.reply({ content: `❌ Ya tienes un ticket abierto: ${existing}`, ephemeral: true });

        const overwrites = [
          { id: guild.roles.everyone.id, deny: ["ViewChannel"] },
          { id: interaction.user.id, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] }
        ];
        if (supportRole) overwrites.push({ id: supportRole, allow: ["ViewChannel", "SendMessages", "ReadMessageHistory"] });

        const channel = await guild.channels.create({
          name: `ticket-${interaction.user.username}`.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 80),
          type: ChannelType.GuildText,
          parent: category?.id,
          permissionOverwrites: overwrites
        });

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder().setCustomId("ticket:close").setLabel("Cerrar ticket").setEmoji("🔒").setStyle(ButtonStyle.Danger)
        );

        await channel.send({
          content: `<@${interaction.user.id}>${supportRole ? ` <@&${supportRole}>` : ""}`,
          embeds: [
            new EmbedBuilder()
              .setTitle("🎫 Ticket abierto")
              .setDescription("Explica tu problema con todos los detalles posibles. Un miembro del equipo te atenderá.")
              .setColor(0x5865f2)
          ],
          components: [row]
        });

        await interaction.reply({ content: `✅ Ticket creado: ${channel}`, ephemeral: true });
        await sendLog(guild, "🎫 Ticket creado", `**Usuario:** ${interaction.user.tag}\n**Canal:** ${channel}`, 0x57f287);
      }

      if (interaction.customId === "ticket:close") {
        const channel = interaction.channel;
        await interaction.reply("🔒 Cerrando ticket en 5 segundos...");
        await sendLog(interaction.guild, "🔒 Ticket cerrado", `**Canal:** ${channel.name}\n**Cerrado por:** ${interaction.user.tag}`, 0xed4245);
        setTimeout(() => channel.delete("Ticket cerrado").catch(() => {}), 5000);
      }
    }
  } catch (error) {
    console.error("❌ Error en interacción:", error);
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction.reply({ content: "❌ Ocurrió un error al ejecutar esta acción.", ephemeral: true }).catch(() => {});
    }
  }
});

client.login(process.env.DISCORD_TOKEN).catch(error => {
  console.error("❌ No se pudo iniciar sesión en Discord:", error);
  process.exit(1);
});
