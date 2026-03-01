#!/bin/bash
# Theme Editor — Claude Code skill installer
# Usage: curl -fsSL https://raw.githubusercontent.com/madebysan/theme-editor/main/install.sh | bash

set -e

SKILL_DIR="$HOME/.claude/skills/theme-editor"
REPO_URL="https://github.com/madebysan/theme-editor"

# Check if Claude Code skills directory exists
if [ ! -d "$HOME/.claude/skills" ]; then
  echo "Creating Claude Code skills directory..."
  mkdir -p "$HOME/.claude/skills"
fi

# Check if already installed
if [ -d "$SKILL_DIR" ]; then
  echo "Theme Editor skill already exists at $SKILL_DIR"
  read -p "Overwrite? (y/N) " -n 1 -r
  echo
  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 0
  fi
  rm -rf "$SKILL_DIR"
fi

echo "Installing Theme Editor skill..."

# Clone to temp directory, copy skill folder, clean up
TMPDIR=$(mktemp -d)
git clone --depth 1 --quiet "$REPO_URL" "$TMPDIR"
cp -r "$TMPDIR/skill" "$SKILL_DIR"
rm -rf "$TMPDIR"

echo ""
echo "Installed to $SKILL_DIR"
echo ""
echo "Usage: type /theme-editor in Claude Code to inject the editor into any"
echo "React + Tailwind v4 + shadcn/ui project."
echo ""
echo "Done!"
