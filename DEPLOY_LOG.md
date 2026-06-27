# DetailsDiscordBot — VPS Deployment Log

Re-homing the bot from **Heroku** (decommissioned) onto the Details! auth-server
VPS as an independent Docker container. Written in the style of
`core/SERVER_DEPLOY_RUNBOOK.md`: each step records what was actually run and its
result, so what you read is the real path.

## Target environment

- **Host:** `177.153.194.191` / `authtails02.vps-kinghost.net`, Ubuntu 24.04,
  Docker 29.6.1, root via SSH key. Same box that runs `details-auth-server`.
- **Coexistence:** the bot binds **no ports** and needs **no** nginx/TLS/DNS/volume.
  It's an outbound-only Discord gateway client, fully independent of the auth server.
- **Footprint:** ~120–150 MB RAM idle (box had 3.3 GiB free at deploy time).
- **Source of truth:** `https://github.com/Terciob19/DetailsDiscordBot` (branch `master`).
- **Discord application:** ID `627905348526931979` (target guild `503971787718131713`,
  the Details! Discord — hardcoded in `bot-core.js`).

## Secrets & portal prerequisites (operator-supplied)

1. **Bot token** → env var `TOKENID`. From **Bot → Reset Token** in the dev portal.
   NOT the Application ID or Public Key. Stored on the box at `/root/discord-bot.env`
   (perms `600`), never echoed to logs.
2. **Privileged Gateway Intents** must be **ON**: **Message Content** and
   **Server Members** (the code requests `MessageContent` + `GuildMembers`).
   If off, `login()` throws `Used disallowed intents` and the container crash-loops.
   - Known dead code: a `presenceUpdate` handler exists but `GuildPresences` is never
     requested, so it never fires. Pre-existing; out of scope for this deploy.

## Steps

### 1. Verify box + source — DONE
- SSH reachable; only `details-auth-server` container running; no host Node; 3.3 GiB free.
- Local mirror `E:\DetailsDiscordBot` in sync with `origin/master` @ `f91d519 "adjustment"`.

### 2. Clone source onto the box — DONE
```bash
git clone https://github.com/Terciob19/DetailsDiscordBot.git /root/details-discord-bot
```
Recorded: cloned at `f91d519`.

### 3. Dockerfile + image build — DONE
Dockerfile written on the box (NOT yet committed to the repo — see "CI follow-up"):
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --omit=dev
COPY . .
CMD ["node","bot-core.js"]
```
```bash
cd /root/details-discord-bot && docker build -t details-discord-bot .
```
Recorded: image `details-discord-bot:latest` built, content size 64.1 MB.

### 4. Store the token — DONE
```bash
umask 077
printf 'TOKENID=%s\n' '<BOT_TOKEN>' > /root/discord-bot.env
ls -la /root/discord-bot.env   # expect -rw------- (600)
```
Recorded: `/root/discord-bot.env` written, perms `-rw-------` (600). Token reset in
the portal at cutover (invalidates the old Heroku token).

### 5. Run the container — DONE
```bash
set -a; . /root/discord-bot.env; set +a
docker run -d --name details-discord-bot --restart unless-stopped \
  -e TOKENID details-discord-bot
docker logs -f details-discord-bot     # expect: "I am ready!"
```
Recorded (2026-06-27): container up, logs printed **"I am ready!"** (login OK ⇒ both
privileged intents confirmed ON). `docker inspect`: `RestartPolicy=unless-stopped`,
`RestartCount=0`, `Running=true`. Coexists with `details-auth-server`. One harmless
discord.js v14 deprecation warning (`ready` → `clientReady`, fires in v15 only).
Verify in-app: bot shows online in the Details! Discord; `/faq` slash command
registers (created guild-scoped on `ready`).

### 6. Decommission Heroku — DONE
Operator confirmed the old Heroku app is disabled (2026-06-27). Only one gateway
session now runs (the VPS container). Token was reset at cutover, so any stale
Heroku dyno couldn't reconnect anyway.
Once verified live here, remove the bot from the old Heroku app
(`dashboard.heroku.com/apps/details-discord-bot`) so two instances don't both
connect (double responses / double bans). Only ONE gateway session should run.

## CI follow-up (auto-deploy on push) — DONE (verified green 2026-06-27)

Chosen approach: **GitHub Actions push-deploy** (SSH from the runner; no inbound
surface on the box). `.github/workflows/deploy.yml` is live; pushing to `master`
auto-rebuilds + recreates the container. The deploy script force-syncs
(`git fetch` + `git reset --hard origin/master` + `git clean -fd`) rather than
`git pull` — a stray untracked `Dockerfile` from the first manual deploy had
aborted a plain pull. How it was enabled:
1. Generate a **dedicated** deploy keypair (not the operator's personal key):
   `ssh-keygen -t ed25519 -f deploy_key -N ''`.
2. Append `deploy_key.pub` to the box's `/root/.ssh/authorized_keys`.
3. Add `deploy_key` (private) as repo secret `DEPLOY_SSH_KEY`.
4. Commit `.github/workflows/deploy.yml` (build+restart on push to `master`).
5. **Commit the `Dockerfile` to the repo** so the runner/box build is reproducible
   (currently it only exists on the box).

```yaml
on: { push: { branches: [master] } }
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: appleboy/ssh-action@v1
        with:
          host: 177.153.194.191
          username: root
          key: ${{ secrets.DEPLOY_SSH_KEY }}
          script: |
            cd /root/details-discord-bot
            git pull --ff-only
            docker build -t details-discord-bot .
            docker restart details-discord-bot
```
