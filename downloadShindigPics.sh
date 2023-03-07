#!/bin/bash
if [ -z "${INPUT_STRING//[0-9]}" ]; then
aws s3 cp s3://textmyguests/$1 $1 --recursive
cd $1
for i in *; do mv "$i" "$i.jpeg"; done
cd ..
zip -r $1.zip $1/
if [[ -d $1 ]]; then
    rm -rf $1
fi
fi
