# Utiliser l'image Node.js officielle
FROM node:18-alpine

# Définir le répertoire de travail
WORKDIR /app

# Copier package.json et package-lock.json
COPY package.json ./
COPY package-lock.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers du projet
COPY . .

# Construire l'application Next.js
RUN npm run build

# Exposer le port de l'application
EXPOSE 3000

# Démarrer l'application
CMD ["npm", "start"]