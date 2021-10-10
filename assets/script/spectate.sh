#! /bin/bash

if test -d  /Applications/League\ of\ Legends.app/Contents/LoL/Game/ ; 
then cd /Applications/League\ of\ Legends.app/Contents/LoL/Game/ && chmod +x ./LeagueofLegends.app/Contents/MacOS/LeagueofLegends ; 
else cd /Applications/League\ of\ Legends.app/Contents/LoL/RADS/solutions/lol_game_client_sln/releases/ && cd $(ls -1vr -d */ | head -1) && cd deploy && chmod +x ./LeagueofLegends.app/Contents/MacOS/LeagueofLegends ; 
fi && 
riot_launched=true ./LeagueofLegends.app/Contents/MacOS/LeagueofLegends "spectator spectator.euw1.lol.riotgames.com:80  $1 $2 EUW1" "-UseRads" "-Locale=en_GB" "-GameBaseDir=.."

