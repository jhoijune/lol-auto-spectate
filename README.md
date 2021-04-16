# LOL Auto Spectate

A program that automatically specates and streams when Faker plays solo rank

## Prerequisite

JRE must be installed if you are using Window and OBS,obs-websocket must be installed

## .env file description

| Name             |                          Meaning                          |
| ---------------- | :-------------------------------------------------------: |
| RIOT_API_KEY     | riot personal api key (not supported development api key) |
| TWITCH_ID        |                    ID number of twitch                    |
| TWITCH_CLIENT_ID |                twitch developers client ID                |
| TWITCH_SECRET    |              twitch developers client secret              |
| TWITCH_TOKEN     |         token with scope channel:manage:broadcast         |
| OBS_PASSWORD     |                  obs-websocket password                   |

## How to use

```bash
$ npm install
$ npm run init
$ npm start
```

## Implementation

[https://twitch.tv/t1_faker_fan](https://twitch.tv/t1_faker_fan)

<iframe src="https://player.twitch.tv/?channel=t1_faker_fan&parent=github.com" frameborder="0" allowfullscreen="true" scrolling="no" height="378" width="620"></iframe>
