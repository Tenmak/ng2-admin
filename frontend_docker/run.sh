#!/bin/bash
shopt -s expand_aliases
source /opt/edjanger/edjanger.alias
CURRENT_PATH=$(echo $PWD)

cd $CURRENT_PATH/data && edjangerrm && edjangerbuild && edjangerrun

cd $CURRENT_PATH/web1 && edjangerrm && edjangerbuild && edjangerrun
cd $CURRENT_PATH/web2 && edjangerrm && edjangerbuild && edjangerrun

cd $CURRENT_PATH/lb1 && edjangerrm && edjangerbuild && edjangerrun
cd $CURRENT_PATH/lb2 && edjangerrm && edjangerbuild && edjangerrun

cd $CURRENT_PATH/hap && edjangerrm && edjangerrun

