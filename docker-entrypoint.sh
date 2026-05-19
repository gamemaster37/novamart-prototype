#!/bin/sh
set -eu

ENV_FILE="/app/server/.env"

if [ -f "$ENV_FILE" ]; then
  while IFS= read -r line || [ -n "$line" ]; do
    case "$line" in
      ""|\#*) continue ;;
      *=*)
        key=${line%%=*}
        value=${line#*=}
        case "$key" in
          *[!A-Za-z0-9_]*|"") continue ;;
        esac
        eval "current=\${$key:-}"
        if [ -z "$current" ]; then
          export "$key=$value"
        fi
        ;;
    esac
  done < "$ENV_FILE"
fi

exec "$@"
