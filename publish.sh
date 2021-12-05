# 安装sshpass
# curl -O -L http://downloads.sourceforge.net/project/sshpass/sshpass/1.05/sshpass-1.05.tar.gz && tar xvzf sshpass-1.05.tar.gz && cd sshpass-1.05 && ./configure && make && sudo make install

#!/bin/bash

if which sshpass 2>/dev/null; then
  echo "sshpass exists!"
else
  echo "nope, no sshpass installed."
  echo '--install sshpass--'
  curl -O -L http://downloads.sourceforge.net/project/sshpass/sshpass/1.05/sshpass-1.05.tar.gz && tar xvzf sshpass-1.05.tar.gz && cd sshpass-1.05 && ./configure && make && sudo make install
  echo '--installed--'
fi

SSH_KEY="App@2018.com"
BUILD_PATH="dist/"
TARGET_PATH="/home/app/web/tools"
PASS_WORD="App@2018.com"
USERNAME="app"
IP="192.180.51.23"

#echo $USER
# sshpass -p App@2018.com ssh app@192.180.51.23

echo '--build--'
npm run build
echo '--build done--'

echo '--uploading--'
sshpass -p $PASS_WORD scp -r $BUILD_PATH $USERNAME@$IP:$TARGET_PATH
# sshpass -p App@2018.com scp -r dist/ app@192.180.51.23:/home/app/web/candys-tools
echo '--end--'