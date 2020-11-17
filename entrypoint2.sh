#entrypoint.sh
bash wait-for-it.sh
npm install
npm run clean-dev

echo "starting API server"

npm run start