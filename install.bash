#!/bin/bash
# Installs the `fiftyone` package and its dependencies.
#
# Usage:
#   bash install.bash
#
# Copyright 2017-2020, Voxel51, Inc.
# voxel51.com
#

# Show usage information
usage() {
    echo "Usage:  bash $0 [-h] [-d]

Getting help:
-h      Display this help message.

Custom installations:
-d      Install developer dependencies. The default is false.
"
}


# Parse flags
SHOW_HELP=false
DEV_INSTALL=false
while getopts "hd" FLAG; do
    case "${FLAG}" in
        h) SHOW_HELP=true ;;
        d) DEV_INSTALL=true ;;
        *) usage ;;
    esac
done
[ ${SHOW_HELP} = true ] && usage && exit 0
OS=$(uname -s)

echo "***** INSTALLING ETA *****"
if [[ ! -d "eta" ]]; then
    echo "Cloning ETA repository"
    git clone https://github.com/voxel51/eta
fi
cd eta
bash install.bash
if [[ ! -f config.json ]]; then
    echo "Installing default ETA config"
    cp config-example.json config.json
fi
cd ..


echo "***** INSTALLING MONGODB *****"
mkdir .fiftyone && cd fiftyone
if [ "${OS}" == "Darwin" ]; then
    curl https://fastdl.mongodb.org/osx/mongodb-macos-x86_64-4.2.6.tgz --output mongodb.tgz
    tar -zxvf mongodb.tgz
elif [ "${OS}" == "Linux" ]; then
    sudo apt-get install libcurl4 openssl
    curl https://fastdl.mongodb.org/linux/mongodb-linux-x86_64-ubuntu1804-4.2.6.tgz --output mongodb.tgz
    tar -zxvf mongodb.tgz
fi


echo "***** INSTALLING FIFTYONE *****"
if [ ${DEV_INSTALL} = true ]; then
    echo "Performing dev install"
    pip install -r requirements/dev.txt
    pre-commit install
else
    pip install -r requirements.txt
fi
pip install -e .


echo "***** INSTALLATION COMPLETE *****"
