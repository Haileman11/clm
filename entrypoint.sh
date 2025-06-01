#!/bin/bash

# Optional: Wait for DB to be available
# until nc -z -v -w30 $DB_HOST 5432
# do
#   echo "⏳ Waiting for PostgreSQL at $DB_HOST:5432..."
#   sleep 2
# done

echo "✅ Connected to DB. Running Prisma push and seed..."
npx prisma db push

# Optional seed
npx prisma db seed

echo "🚀 Starting application..."
npm start
