#!/bin/bash
deno task build 
ssh rodhfr@j.rodhfr.shop "rm -f /home/rodhfr/Docker/Silverbullet/space/_plug/ytinfo.plug.js" 
scp ytinfo.plug.js rodhfr@192.168.1.150:Docker/Silverbullet/space/_plug/
