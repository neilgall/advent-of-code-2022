#!/bin/bash
set -eu

fail() {
    echo "ERROR: $*"
    exit 1
}

day=${1:-}
if [ -z "${day}" ]; then
    day=$(printf "%(%e)T" | xargs)
fi

dir="day${day}"
test ! -d "$dir" || fail "${dir} already exists"

cp -R template "day${day}"
sed -i "s/dayX/${dir}/" "${dir}/package.json"

cd "${dir}"
npm install
