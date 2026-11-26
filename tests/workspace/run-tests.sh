#!/usr/bin/env bash
# Workspace engine test suite.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
cd "$SCRIPT_DIR"

echo "Workspace engine tests"
echo "Repository: $(cd ../.. && pwd)"
echo ""

node --test .
