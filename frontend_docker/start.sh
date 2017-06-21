#!/bin/bash
shopt -s expand_aliases
source /opt/edjanger/edjanger.alias
CURRENT_PATH=$(echo $PWD)

cd $CURRENT_PATH/web1 && edjangerstart

cd $CURRENT_PATH/web1 && edjangerstart
cd $CURRENT_PATH/web2 && edjangerstart

cd $CURRENT_PATH/lb1 && edjangerstart
cd $CURRENT_PATH/lb2 && edjangerstart

cd $CURRENT_PATH/hap && edjangerstart

