#!/bin/bash

# Specify the directory you want to search
directory=""

# Loop through all files and directories
for item in "$directory"/*; do
    if [ -e "$item" ]; then
        echo "$item"
    fi
done