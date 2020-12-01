#entypoint.sh

npm install
npm run clean-prod

echo "startApi Server"

NODE_ENV=production npm run start-prod