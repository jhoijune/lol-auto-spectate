# LOL Auto Spectate

A program that automatically specates and streams when Faker plays solo rank

## Prerequisite

JRE must be installed if you are using Window and OBS,obs-websocket must be installed (run as administrator in Windows)

## .env file description

| Name             |                          Meaning                          |
| ---------------- | :-------------------------------------------------------: |
| RIOT_API_KEY     | riot personal api key (not supported development api key) |
| TWITCH_ID        |                    ID number of twitch                    |
| TWITCH_CLIENT_ID |                twitch developers client ID                |
| TWITCH_SECRET    |              twitch developers client secret              |
| TWITCH_TOKEN     |         token with scope channel:manage:broadcast         |
| OBS_PASSWORD     |                  obs-websocket password                   |
| CHANNEL          |                    twitch channel name                    |
| AUTH_USERS       |  list of users who can use chat commands separated by &   |

## How to use

```bash
$ npm install
$ npm run init
$ npm start
```

## Command List

| Command         |                   Description                    |
| --------------- | :----------------------------------------------: |
| !stopgame       |      quit if the game is currently running       |
| !stopstreaming  | terminate streaming if it is currently streaming |
| !stopprogram    |                   stop program                   |
| !pauseprogram   |                  pause program                   |
| !restartprogram |                 restart program                  |
| !openinterface  |            open lol client interface             |
| !fix\<num\>     |    fix view if the game is currently running     |

## Implementation

[https://twitch.tv/t1_faker_fan](https://twitch.tv/t1_faker_fan)
