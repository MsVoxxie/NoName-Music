#!/usr/bin/env bash
# Wrapper to force safe args for yt-dlp used by @distube/yt-dlp
exec /usr/local/bin/yt-dlp --no-warnings --ignore-config "$@"
