const { REST, Routes } = require("discord.js");

module.exports = async function ready(client, config, commands) {
  console.log(`🤖 NexoCraft conectado como ${client.user.tag}`);
  client.user.setActivity("/help • NexoCraft", { type: 0 });

  const rest = new REST({ version: "10" }).setToken(config.token);
  console.log("🔄 Registrando comandos de NexoCraft...");

  await rest.put(
    Routes.applicationGuildCommands(config.clientId, config.guildId),
    { body: commands }
  );

  console.log(`✅ ${commands.length} comandos registrados correctamente.`);
};
