#!/usr/bin/env bash

set -ex

BASEDIR=$(dirname $(dirname $(realpath $0)))

cd $BASEDIR

# Save database URL to dotenv file for Prisma
if [ -z $DEVCONTAINER ]
then
  echo "DATABASE_URL=\"postgresql://postgres:1234@localhost:5443/skkuding?schema=public\"" > .env
else
  echo "DATABASE_URL=\"postgresql://postgres:1234@skkuding-study-dev-db:5432/skkuding?schema=public\"" > .env
fi

# Use docker-compose profile
if [ -z $DEVCONTAINER ]
then
  docker-compose up -d
fi

echo "JWT_SECRET=1234" >> .env

# Install packages
npm install

# Generate graphql types
npx ts-node generate-typings

# Apply database migration
for i in {1..5}
do
  cd $BASEDIR
  npx prisma migrate dev && break # break if migration succeed
  echo -e '\n⚠️ Failed to migrate. Waiting for db to be ready...\n'
  sleep 5
done

# Seeding database
npx prisma migrate reset -f