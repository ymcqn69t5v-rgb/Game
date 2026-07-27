#!/usr/bin/env bash
set -euo pipefail

cat payload/part-* | base64 --decode > /tmp/nimbus-hq.tar.gz
tar -xzf /tmp/nimbus-hq.tar.gz -C .
rm -rf payload

echo "[Nimbus HQ] Produkční zdroj byl připraven pro Vercel build."
