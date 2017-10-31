#!/usr/bin/env bash
set -e # halt script on error

# If this is the deploy branch, push it up to gh-pages
if [ $TRAVIS_PULL_REQUEST = "false" ] && [ $TRAVIS_BRANCH = ${DEPLOY_BRANCH} ]; then
  echo "Get ready, we're copying to Bluehost!"
  # SCP to Bluehost, -rp is recursive and keeps file permissions
  scp -i rdr -o UserKnownHostsFile=/dev/null -o StrictHostKeyChecking=no -rp _site/* ${BLUEHOST_USER}@${BLUEHOST_PATH}
else
  echo "Not a publishable branch so we're all done here"
fi
