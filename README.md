# BudgETS
 Une application financière pour les clubs étudiants de l'ETS.

## Démarrage de l'application
 ### Requis
 1. [npm](https://www.npmjs.com/get-npm)
 2. [yarn](https://classic.yarnpkg.com/en/docs/install/)

 ### Installation d'un service d'hôte local
 1. Installez une version de l'application [Ampps](http://www.ampps.com/downloads).
 2. Une fois installée, lancez l'application et démarrez MySQL.
 3. Vous avez maintenant accès à un panneau de contrôle à l'adresse : [localhost](http://localhost/phpmyadmin).
 4. Créez une base de données appelée __BudgetETS__.

 ### Démarrage du serveur backend
 1. Ouvrez un terminal au niveau de la racine de l'application.
 2. Assurez-vous d'avoir la dernière version des dépendances en faisant la commande : ```npm install```.
 3. Démarrez le serveur avec la commande : ```npm start```.

 ### Démarrage du client frontend
 1. Ouvrez un terminal au niveau du dossier /frontend de l'application.
 2. Assurez-vous d'avoir la dernière version des dépendances en faisant la commande : ```yarn install```.
 3. Démarrez le client avec la commande : ```yarn start```.

 ### Nettoyer la base de données
 On peut remettre la base de données à son état initial en exécutant la commande : ```npm run db:reset```.
 Du même coup, la base de données sera supprimée, elle sera créée à nouveau et des données par défaut y seront insérer.
 Les données par défaut sont définies dans le dossier _'./seeders'_.
