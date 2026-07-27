#!/bin/bash

set -euo pipefail

SCRIPT_DIR=$(dirname "$(readlink -f "$0")")
PLUGIN_ROOT="$SCRIPT_DIR/.."
ENV_FILE="$PLUGIN_ROOT/.env"

if [ -f "$ENV_FILE" ]; then
  set -o allexport
  source "$ENV_FILE"
  set +o allexport
fi

PLUGIN_NAME="live-transcription-plugin"
CONTAINER_NAME=${1:-${LOCAL_CONTAINER_NAME:-}}
PLUGINS_PATH="/var/www/bigbluebutton-default/assets/plugins"
TARGET_PATH="$PLUGINS_PATH/$PLUGIN_NAME/dist"

if [ -z "$CONTAINER_NAME" ]; then
  echo "Pass a container name or set LOCAL_CONTAINER_NAME in .env."
  exit 1
fi

if ! docker ps -q --filter "name=^${CONTAINER_NAME}$" | grep -q .; then
  echo "Container '$CONTAINER_NAME' is not running."
  exit 1
fi

if [ ! -d "$PLUGIN_ROOT/dist" ]; then
  echo "dist/ not found. Run 'npm run build-bundle' first."
  exit 1
fi

docker exec "$CONTAINER_NAME" rm -rf "$TARGET_PATH"
docker exec "$CONTAINER_NAME" mkdir -p "$TARGET_PATH"
docker cp "$PLUGIN_ROOT/dist/." "$CONTAINER_NAME:$TARGET_PATH"
echo "Plugin deployed to $CONTAINER_NAME:$TARGET_PATH"
