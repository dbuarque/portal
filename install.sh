#!/usr/bin/env bash

set -ue

# install deps
apt-get update

# install confd for config file management
wget -nv -O /usr/local/bin/confd https://github.com/kelseyhightower/confd/releases/download/v${CONFD_VERSION}/confd-${CONFD_VERSION}-linux-amd64
chmod +x /usr/local/bin/confd

# cleanup
apt-get autoremove -y

# cleanup apt cache
rm -rf /var/lib/apt/lists/*
