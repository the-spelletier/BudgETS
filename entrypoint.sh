#entrypoint.sh

npm install
npm uninstall bcrypt
npm install bcrypt
npm run clean-dev

echo "Starting API server"

npm run start
