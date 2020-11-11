#entrypoint.sh

npm install
npm run clean-dev

echo "starting API server"

npm run start