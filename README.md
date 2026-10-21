# 🤖 NexoCraft Bot

Bot de Discord para **NexoCraft**, preparado para **Node.js 20+** y **Render**.

## ✨ Incluye

- Comandos slash registrados automáticamente como **comandos globales**.
- Configuración independiente por servidor con `/configurar` y `/configuracion`.
- `/help`, `/ping`, `/serverinfo`, `/userinfo`.
- Moderación: `/ban`, `/kick`, `/timeout`, `/clear`.
- Sistema de tickets con botón.
- Logs de moderación y tickets.
- Bienvenida y despedida.
- Estado del bot: `/help • NexoCraft`.

## 🔐 Variables de entorno

Copia `.env.example` como `.env` para probarlo en local. En Render, agrega las mismas variables en **Environment**.

Variables necesarias para iniciar:
- `DISCORD_TOKEN`: token secreto del bot.
- `CLIENT_ID`: Application ID del bot en Discord Developer Portal.

`GUILD_ID` ahora es opcional y puede quedar vacío. Los comandos se registran globalmente, así que no se necesita un ID de servidor para registrarlos.

No subas nunca tu `DISCORD_TOKEN` a GitHub ni lo compartas públicamente. Si se expone, restablécelo en Discord Developer Portal.

## 🌍 Comandos globales

El bot registra los comandos mediante la ruta global de Discord. Los comandos podrán usarse en los servidores donde esté invitado el bot y tenga los permisos necesarios.

**Importante:** después del primer despliegue, Discord puede tardar un tiempo en propagar los comandos globales. Los comandos globales no aparecen tan rápido como los comandos de un servidor de prueba.

## 🚀 Render

1. En Render crea un **Background Worker**.
2. Conecta el repositorio `izkyro123-hash/NexoCraft-Bot`.
3. Build Command: `npm install`
4. Start Command: `npm start`
5. Configura las variables de entorno de `.env.example`. Deja `GUILD_ID` vacío.
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

## ⚙️ Configurar cada servidor

Como los comandos son globales, puedes invitar el bot a varios servidores y configurar cada uno de forma independiente. En cada servidor, alguien con permiso **Manage Server / Gestionar servidor** debe ejecutar `/configurar` y seleccionar los canales/rol que quiera configurar. Usa `/configuracion` para comprobar los valores guardados. Las opciones que no selecciones al ejecutar `/configurar` no se modifican.

La configuración por servidor se guarda en `data/guild-config.json`. Este almacenamiento local funciona si el hosting conserva los archivos entre reinicios y despliegues. Si el hosting borra el disco al desplegar, configura un disco persistente o cambia el almacenamiento a una base de datos antes de depender de estos ajustes en producción.

## 🎫 Tickets

Configura:
- `TICKET_CATEGORY_ID`: ID de la categoría donde se crearán los tickets.
- `TICKET_SUPPORT_ROLE_ID`: ID del rol que tendrá acceso a los tickets.
- `MOD_LOG_CHANNEL_ID` o `LOG_CHANNEL_ID`: ID del canal de logs.

## ⚠️ Importante

Aunque los comandos son globales, la bienvenida, despedida, tickets y logs usan IDs de canales, categorías y roles configurados en el archivo de entorno. Esos IDs son específicos de cada servidor. Para usar esas funciones en varios servidores, habría que adaptar el bot para tener una configuración independiente por servidor.
