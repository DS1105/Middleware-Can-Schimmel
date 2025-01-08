### General Information

#### Frontend
- **Folder:** `src\app`  
- **File:** `page.js`

---

#### Backend
- **Folder:** `shopping-server`  
- **File:** `server.js`

---

#### Database
- **Folder:** `shopping-server`  
- **File:** `test-db.js`

---

#### Docker
- **File:** `docker-compose.yml`  
- **File:** `Dockerfile`

---

#### Kubernetes
- **Folder:** `kubernetes.files`  
- **Files:** All files are important

---

### Steps to Start the Program

#### Starting the Application and Database
1. Open **VS Code**.  
2. Navigate to the folder `src` and open the file `page.js`. Open a new terminal.  
3. Run the command: `npm run dev`.  
4. Navigate to the folder `shopping-server` and open the file `server.js`. Open a new terminal.  
5. Run the command: `node server.js`.  
6. Navigate to the folder `shopping-server` and open the file `test-db.js`. Open a new terminal.  
7. Run the command: `node test-db.js`.

---

### Setting Up Kubernetes

1. **Enable Kubernetes** in Docker Desktop:  
   - Open **Docker Desktop**.  
   - Go to **Settings > Kubernetes**.  
   - Enable the option **Enable Kubernetes**.  
   - Click **Apply & Restart**.  

---

### Starting Docker and Kubernetes

1. Open **Docker Desktop**.  
2. In **VS Code**, navigate to the `Dockerfile` and open a new terminal.  
3. Run the command: `docker build -t dockerscds .`.  
4. Run the command: `docker run -p 3000:3000 dockerscds`.  
5. Run the command: `kubectl apply -f kubernetes.files`.

---

### 12-Factor Compliance

We maintain a separate document for 12-factor compliance. To review this, open the file `12-factor-doc.md`.