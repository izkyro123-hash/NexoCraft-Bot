const fs = require("node:fs");
const path = require("node:path");

const dataDir = path.join(__dirname, "..", "data");
const dataFile = path.join(dataDir, "guild-config.json");

function readAll() {
  try {
    return JSON.parse(fs.readFileSync(dataFile, "utf8"));
  } catch (error) {
    if (error.code !== "ENOENT") console.error("No se pudo leer la configuración por servidor:", error);
    return {};
  }
}

function getGuildConfig(guildId, defaults = {}) {
  const all = readAll();
  const saved = all[guildId] || {};
  return {
    ...defaults,
    welcomeChannelId: saved.welcomeChannelId ?? defaults.welcomeChannelId,
    goodbyeChannelId: saved.goodbyeChannelId ?? defaults.goodbyeChannelId,
    modLogChannelId: saved.modLogChannelId ?? defaults.modLogChannelId,
    ticketCategoryId: saved.ticketCategoryId ?? defaults.ticketCategoryId,
    ticketSupportRoleId: saved.ticketSupportRoleId ?? defaults.ticketSupportRoleId
  };
}

function setGuildConfig(guildId, patch) {
  fs.mkdirSync(dataDir, { recursive: true });
  const all = readAll();
  all[guildId] = { ...(all[guildId] || {}), ...patch };
  fs.writeFileSync(dataFile, JSON.stringify(all, null, 2) + "\n", "utf8");
  return all[guildId];
}

module.exports = { getGuildConfig, setGuildConfig };
