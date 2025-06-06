# Uptime Katalon

<a target="_blank" href="https://github.com/louislam/uptime-kuma"><img src="https://img.shields.io/github/stars/louislam/uptime-kuma" /></a> <a target="_blank" href="https://hub.docker.com/r/louislam/uptime-kuma"><img src="https://img.shields.io/docker/pulls/louislam/uptime-kuma" /></a> <a target="_blank" href="https://hub.docker.com/r/louislam/uptime-kuma"><img src="https://img.shields.io/docker/v/louislam/uptime-kuma/latest?label=docker%20image%20ver." /></a> <a target="_blank" href="https://github.com/louislam/uptime-kuma"><img src="https://img.shields.io/github/last-commit/louislam/uptime-kuma" /></a>  <a target="_blank" href="https://opencollective.com/uptime-kuma"><img src="https://opencollective.com/uptime-kuma/total/badge.svg?label=Open%20Collective%20Backers&color=brightgreen" /></a>
[![GitHub Sponsors](https://img.shields.io/github/sponsors/louislam?label=GitHub%20Sponsors)](https://github.com/sponsors/louislam)

<div align="center" width="100%">
    <img src="./public/icon.svg" width="128" alt="" />
</div>

It is a self-hosted monitoring tool like "Uptime Robot".

<img src="https://uptime.kuma.pet/img/dark.jpg" width="700" alt="" />

## 🥔 Live Demo

Try it!

- Tokyo Demo Server: https://demo.uptime.kuma.pet (Sponsored by [Uptime Katalon Sponsors](https://github.com/louislam/uptime-kuma#%EF%B8%8F-sponsors))
- Europe Demo Server: https://demo.uptime-kuma.karimi.dev:27000 (Provided by [@mhkarimi1383](https://github.com/mhkarimi1383))

It is a temporary live demo, all data will be deleted after 10 minutes. Use the one that is closer to you, but I suggest that you should install and try it out for the best demo experience.

## ⭐ Features

* Monitoring uptime for HTTP(s) / TCP / HTTP(s) Keyword / Ping / DNS Record / Push / Steam Game Server / Docker Containers.
* Fancy, Reactive, Fast UI/UX.
* Notifications via Telegram, Discord, Gotify, Slack, Pushover, Email (SMTP), and [90+ notification services, click here for the full list](https://github.com/louislam/uptime-kuma/tree/master/src/components/notifications).
* 20 second intervals.
* [Multi Languages](https://github.com/louislam/uptime-kuma/tree/master/src/languages)
* Multiple Status Pages
* Map Status Page to Domain
* Ping Chart
* Certificate Info
* Proxy Support
* 2FA available

## 🔧 How to Install

### 🐳 Docker

```bash
docker run -d --restart=always -p 3001:3001 -v uptime-kuma:/app/data --name uptime-kuma louislam/uptime-kuma:1
```

⚠️ Please use a **local volume** only. Other types such as NFS are not supported.

Browse to http://localhost:3001 after starting.

### 💪🏻 Non-Docker

Required Tools: 
- [Node.js](https://nodejs.org/en/download/) >= 14
- [Git](https://git-scm.com/downloads) 
- [pm2](https://pm2.keymetrics.io/) - For run in background

```bash
# Update your npm to the latest version
npm install npm -g

git clone https://github.com/louislam/uptime-kuma.git
cd uptime-kuma
npm run setup

# Option 1. Try it
node server/server.js

# (Recommended) Option 2. Run in background using PM2
# Install PM2 if you don't have it: 
npm install pm2 -g && pm2 install pm2-logrotate

# Start Server
pm2 start server/server.js --name uptime-kuma


```
Browse to http://localhost:3001 after starting.

More useful PM2 Commands

```bash
# If you want to see the current console output
pm2 monit

# If you want to add it to startup
pm2 save && pm2 startup
```

### Advanced Installation

If you need more options or need to browse via a reverse proxy, please read:

https://github.com/louislam/uptime-kuma/wiki/%F0%9F%94%A7-How-to-Install

## 🆙 How to Update

Please read:

https://github.com/louislam/uptime-kuma/wiki/%F0%9F%86%99-How-to-Update

## 🆕 What's Next?

I will mark requests/issues to the next milestone.

https://github.com/louislam/uptime-kuma/milestones

Project Plan:

https://github.com/users/louislam/projects/4/views/1

## ❤️ Sponsors

Thank you so much! (GitHub Sponsors will be updated manually. OpenCollective sponsors will be updated automatically, the list will be cached by GitHub though. It may need some time to be updated)

<img src="https://uptime.kuma.pet/sponsors?v=6" alt />

## 🖼 More Screenshots

Light Mode:

<img src="https://uptime.kuma.pet/img/light.jpg" width="512" alt="" />

Status Page:

<img src="https://user-images.githubusercontent.com/1336778/134628766-a3fe0981-0926-4285-ab46-891a21c3e4cb.png" width="512" alt="" />

Settings Page:

<img src="https://louislam.net/uptimekuma/2.jpg" width="400" alt="" />

Telegram Notification Sample:

<img src="https://louislam.net/uptimekuma/3.jpg" width="400" alt="" />

## Motivation

* I was looking for a self-hosted monitoring tool like "Uptime Robot", but it is hard to find a suitable one. One of the close ones is statping. Unfortunately, it is not stable and no longer maintained.
* Want to build a fancy UI.
* Learn Vue 3 and vite.js.
* Show the power of Bootstrap 5.
* Try to use WebSocket with SPA instead of REST API.
* Deploy my first Docker image to Docker Hub.

If you love this project, please consider giving me a ⭐.

## 🗣️ Discussion

### Issues Page

You can discuss or ask for help in [issues](https://github.com/louislam/uptime-kuma/issues).

### Subreddit

My Reddit account: [u/louislamlam](https://reddit.com/u/louislamlam).  
You can mention me if you ask a question on Reddit.
[r/Uptime kuma](https://www.reddit.com/r/UptimeKuma/)

## Contribute

### Test Pull Requests

There are a lot of pull requests right now, but I don't have time to test them all.

If you want to help, you can check this:
https://github.com/louislam/uptime-kuma/wiki/Test-Pull-Requests

### Test Beta Version

Check out the latest beta release here: https://github.com/louislam/uptime-kuma/releases

### Bug Reports / Feature Requests
If you want to report a bug or request a new feature, feel free to open a [new issue](https://github.com/louislam/uptime-kuma/issues).

### Translations
If you want to translate Uptime Katalon into your language, please read: https://github.com/louislam/uptime-kuma/tree/master/src/languages

Feel free to correct my grammar in this README, source code, or wiki, as my mother language is not English and my grammar is not that great.

### Create Pull Requests
If you want to modify Uptime Katalon, please read this guide and follow the rules here: https://github.com/louislam/uptime-kuma/blob/master/CONTRIBUTING.md
# kqe-monitor-uptime
# kqe-monitor-uptime
