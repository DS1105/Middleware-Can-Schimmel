# Verwende das offizielle Node.js-Image
FROM node:20-slim

# Arbeitsverzeichnis im Container festlegen
WORKDIR /app

# Kopiere die package.json und package-lock.json
COPY package*.json ./

# Installiere die Abhängigkeiten
RUN npm install

# Kopiere den gesamten Quellcode in den Container
COPY . .

# Exponiere den Port 3000
EXPOSE 3000

# Setze den Standardbefehl, um die Anwendung zu starten
CMD ["node", "src/app/page.js"]  # Hier wird der korrekte Pfad zur Seite angepasst

