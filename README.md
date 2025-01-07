Here’s your translated guide in English:

---

### Front End:
**Folder:** `src\app`  
**File:** `page.js`

---

### Backend:
**Folder:** `shopping-server`  
**File:** `server.js`

**Steps:**
1. Open the **Command Prompt (CMD)** and navigate to the program folder.  
2. Type `npm run dev` and execute the command.  
3. Open **VS Code** and navigate to the file using `cd shopping-server` in the `shopping-server` folder.  
4. Open a new terminal in **VS Code**.  
5. Execute the command `node test-ds.js`.

---

### Kubernetes:

#### Docker Desktop:
Make sure that Kubernetes is enabled in Docker Desktop.

1. Open **Docker Desktop**.  
2. Go to **Settings > Kubernetes** and enable the option **Enable Kubernetes**.  
3. Click **Apply & Restart**.

#### Docker Image:
Your Docker image must be created and available. You can either create it locally or store it in a container registry (e.g., Docker Hub).

- The Docker image must be named: **dockerscds**.  
- Start Docker before Kubernetes.

#### Start Kubernetes:
Finally, start Kubernetes by running:  
```bash
kubectl apply -f k8s/
```

--- 

Let me know if you need further assistance!