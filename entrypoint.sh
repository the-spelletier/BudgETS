#entrypoint.sh

npm install
npx sequelize db:create
npx sequelize db:migrate
npm run clean-dev
npm start
