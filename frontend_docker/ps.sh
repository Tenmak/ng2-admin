#!/bin/bash
shopt -s expand_aliases
source /opt/edjanger/edjanger.alias
CURRENT_PATH=$(echo $PWD)

cd $CURRENT_PATH/web1 && edjangerps
cd $CURRENT_PATH/web2 && edjangerps

cd $CURRENT_PATH/lb1 && edjangerps
cd $CURRENT_PATH/lb2 && edjangerps

cd $CURRENT_PATH/hap && edjangerps

