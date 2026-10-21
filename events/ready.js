const { REST, Routes } = require("discord.js");

module.exports = async function ready(client, config, commands) {
  console.log("🤖 NexoCraft conectado como " + client.user.tag);
  client.user.setActivity("/help • NexoCraft", { type: 0 });

  const rest = new REST({ version: "10" }).setToken(config.token);
  console.log("🔄 Registrando comandos globales de NexoCraft...");

  await rest.put(
    Routes.applicationCommands(config.clientId),
    { body: commands }
  );

  console.log("✅ " + commands.length + " comandos globales registrados correctamente.");
  console.log("ℹ️ Los comandos globales pueden tardar un tiempo en aparecer en Discord.");
};
