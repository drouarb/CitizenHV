# Install

## Enable VM inside VMWare

Add to the .vmx file

```ini
vhv.enable = "TRUE"
```



## Check KVM compatibility

```bash
add-apt-repository universe
apt update
apt install cpu-checker
```



```bash
linuxtechi@kvm-ubuntu18-04:~$ sudo kvm-ok
INFO: /dev/kvm exists
KVM acceleration can be used
linuxtechi@kvm-ubuntu18-04:~$
```



## Install KVM

```bash
apt install qemu qemu-kvm libvirt-bin  bridge-utils  virtinst libosinfo-bin nbd-client
```

## Create a new VM

#### Get OS Variant

```bash
osinfo-query os
```

## Create the VM

```bash
virt-install																\
	-n citizen-vm															\
	--description "Citizen APP sandbox"										\
	--os-type=Linux															\
	--os-variant=ubuntu16.04												\
	--ram=1096																\
	--vcpus=1																\
	--disk path=/var/lib/libvirt/images/template.img,bus=virtio,size=10		\
	--network bridge:virbr0													\
	--graphics none															\
	--location /mnt/hgfs/CitizenHV/ubuntu-18.04.1-live-server-amd64.iso		\
	--extra-args console=ttyS0
```

## Add TTY output

Add

```
console=ttyS0
```

between

```
quiet (console=ttyS0) splash
```

## Disable FSCK

http://linuxscripter.blogspot.com/2012/03/how-to-disable-fsck-on-reboot.html

## Create the tmpfs

Add to fstab

```ini
tmpfs /opt/citizen tmpfs defaults,size=256M 0 0
```



## Password of the template

```
GpDQyA7gZ84qfAH3
```



## Bind and ubind

```
virsh console $VM
#Ubind MACOS French -> CTRL SHIFT ($*€)
```

# Node APP deployment

## Ubuntu node deps

```bash
#Node repository
curl -sL https://deb.nodesource.com/setup_10.x | bash -
#Yarn Repository
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | tee /etc/apt/sources.list.d/yarn.list

#Install all
apt update && apt install nodejs yarn build-essential pkg-config libvirt-dev

#install the app
yarn i
```

# Citizen APP deployement

### Install JRE

```bash
apt install default-jre default-jdk jq curl
```

## Extract on the fly

https://unix.stackexchange.com/questions/2690/how-to-redirect-output-of-wget-as-input-to-unzip

or

https://www.reddit.com/r/linuxquestions/comments/1ihjjz/piping_a_zip_file_from_curl_to_unzip/

## Init script

```bash
#!/bin/bash

cd /opt/citizen
rm -rf *
HVPORT=3000

#Get the config from the HV
IP=$(/sbin/ip route | awk '/default/ { print $3 }')
config=$(curl http://$IP:$HVPORT/callback/config)

#Download front
git clone --depth=1 --single-branch -b $(jq -r .front_branch <<< "$config") $(jq -r .front_url <<< "$config")
cd /opt/citizen/Ecclesia

#Get config for front
curl http://$IP:$HVPORT/callback/front -o config.json

#Build
yarn install --cache-folder=/opt/citizen/yarn_cache/
yarn run --cache-folder=/opt/citizen/yarn_cache/ start:dev &

sleep 5

rm -rf /opt/citizen/yarn_cache/

#Download api
wget -qO- $(jq -r .api_url <<< "$config") | jar xvf /dev/stdin

#Env
export AWS_ACCESS_KEY=$(jq -r .aws_key <<< "$config")
export AWS_SECRET_ACCESS_KEY=$(jq -r .aws_secret <<< "$config")
export POSTGRESQL_ADDON_URL=$(jq -r .db_url <<< "$config")
export POSTGRESQL_ADDON_USER=$(jq -r .db_user <<< "$config")
export POSTGRESQL_ADDON_PASSWORD=$(jq -r .db_pass <<< "$config")

curl http://$IP:$HVPORT/callback/done

#Run API
bash /opt/citizen/ecclesia-*-SNAPSHOT/bin/ecclesia -Dplay.evolutions.db.postgres.autoApply=true -Dhttp.port=9000
```



## Service systemd

```
[Unit]
Description=citizen service
After=nginx.service

[Service]
ExecStart=/usr/local/bin/citizen_start
Restart=always
RestartSec=1
StandardOutput=syslog
StandardError=syslog
SyslogIdentifier=citizen
WorkingDirectory=/opt/citizen/
User=citizen
Group=citizen

[Install]
WantedBy=multi-user.target
```

