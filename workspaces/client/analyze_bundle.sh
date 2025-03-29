#!/bin/bash

# デフォルト値の設定
DEFALT_SIZE="parsed"

# オプションの処理
while getopts "s:" opt; do
  case $opt in
    s)
      DEFALT_SIZE="$OPTARG"
      ;;
    \?)
      echo "無効なオプション: -$OPTARG" >&2
      exit 1
      ;;
  esac
done

pnpm run build
npx webpack --profile --json > stats.json
npx webpack-bundle-analyzer stats.json dist -s "$DEFALT_SIZE"
