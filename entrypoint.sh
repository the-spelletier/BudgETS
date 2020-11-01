#entrypoint.sh

npm install
npx sequelize mysql:migrate
npm run dev