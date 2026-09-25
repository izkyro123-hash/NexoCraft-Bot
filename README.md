# 🤖 NexoCraft Bot

Bot de Discord para **NexoCraft**, preparado para **Node.js 20+** y **Render**.

## ✨ Incluye

- Slash commands registrados automáticamente al iniciar.
- `/help`, `/ping`, `/serverinfo`, `/userinfo`.
- Moderación: `/ban`, `/kick`, `/timeout`, `/clear`.
- Sistema de tickets con botón.
- Logs de moderación y tickets.
- Bienvenida y despedida.
- Estado del bot: `/help • NexoCraft`.

## 🔐 Variables de entorno

Copia `.env.example` como `.env` para probarlo en local. En Render, agrega las mismas variables en **Environment**.

No subas nunca tu `DISCORD_TOKEN` a GitHub.

## 🚀 Render

1. En Render crea un **Background Worker**.
2. Conecta el repositorio `izkyro123-hash/NexoCraft-Bot`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configura las variables de entorno del archivo `.env.example`.
6. Haz Deploy.

## 🤖 Discord Developer Portal

El bot necesita los permisos adecuados para sus funciones, especialmente:
- View Channels
- Send Messages
- Read Message History
- Manage Channels
- Manage Messages
- Kick Members
- Ban Members
- Moderate Members

Para la bienvenida/despedida, activa el intent **Server Members Intent** en el Developer Portal.

## 🎫 Tickets

Configura:
- `TICKET_CATEGORY_ID`: categoría donde se crearán los tickets.
- `TICKET_SUPPORT_ROLE_ID`: rol que tendrá acceso a los tickets.
- `MOD_LOG_CHANNEL_ID` o `LOG_CHANNEL_ID`: canal de logs.

## ⚠️ Importante

Los comandos se registran como **guild commands** usando `CLIENT_ID` + `GUILD_ID`, por lo que aparecen rápidamente en ese servidor. Si cambias de servidor, cambia `GUILD_ID`.
