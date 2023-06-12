#!/usr/bin/env bash

KEYSTORE_HOST=${KEYSTORE_HOST:-$1}
KEYSTORE_ACCESS_TOKEN=${KEYSTORE_ACCESS_TOKEN:-$2}

setup_git() {
  echo "Setup git..."
  git config user.name "GitHub Action"
  git config user.email "action@github.com"
  git config pull.rebase true
}

setup_npm() {
  echo "Update npm..."
  npm install npm@latest -g || exit 1
}

update_version() {
  local SEARCH_PATTERN="\"version\": "
  local FILE="package.json"

  echo "Patch version..."

  git status

  if git diff HEAD~ HEAD --unified=0 -- "$FILE" | grep -q "+.*$SEARCH_PATTERN.*"
    then
      echo "Parameter 'version' in $FILE already updated, skip auto-patching..."
    else
      git stash
      npm version patch
  fi

  npm ci
}

publish() {
  local NPM_AUTH_TOKEN

  echo "Load npm access token for publishing..."
  NPM_AUTH_TOKEN=$(
    curl \
      -X "GET" \
      -H "Authorization: Bearer $KEYSTORE_ACCESS_TOKEN" \
      --url "$KEYSTORE_HOST/applications/jovy/publishing/npm/access-token"
  )

  echo "Publish..."
  NODE_AUTH_TOKEN="$NPM_AUTH_TOKEN" npm publish --access public --provenance || exit 1
}

update_git_branch() {
  echo 'Update main branch...'
  git add .
  git commit -m "Update version"
  git pull origin main
  git push origin main
}

main() {
  setup_git
  setup_npm
  update_version
  publish
  update_git_branch
}

main
