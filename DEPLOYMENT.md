# SnapGram — Complete Deployment Guide
## GitHub → Render (Backend) + Vercel (Frontend)

---

## OVERVIEW

```
Your Computer
    │
    ▼
GitHub Repository              ← Source of truth
    │
    ├──► Render.com             ← Backend (Spring Boot API)
    │    Port: auto-assigned    URL: https://snapgram-backend.onrender.com
    │
    └──► Vercel.com             ← Frontend (React/Vite SPA)
                                URL: https://snapgram.vercel.app
```

**What you need (all free):**
- GitHub account: https://github.com
- MongoDB Atlas account: https://cloud.mongodb.com
- Cloudinary account: https://cloudinary.com
- Gmail account (for email notifications)
- Render account: https://render.com
- Vercel account: https://vercel.com

---

## PHASE 1: SETUP EXTERNAL SERVICES

Before deploying, you need credentials from these services.

### 1A. MongoDB Atlas (Database)

1. Go to https://cloud.mongodb.com → sign up/in
2. Click **"Create"** → choose **M0 Free** tier → pick any region → **Create**
3. When prompted to create a user:
   - Username: `snapgramuser`
   - Password: click **"Autogenerate"** → copy and save it
   - Click **"Create User"**
4. When prompted for IP Access:
   - Click **"Add My Current IP"**
   - ALSO click **"Add IP Address"** → type `0.0.0.0/0` → **Confirm**
   - This allows Render to connect from any IP
5. Click **"Finish and Close"** → **"Go to Databases"**
6. Click **"Connect"** on your cluster → **"Drivers"**
7. Copy the connection string. It looks like:
   ```
   mongodb+srv://snapgramuser:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
8. Replace `<password>` with your actual password
9. Insert `/snapgram` before the `?`:
   ```
   mongodb+srv://snapgramuser:YOURPASSWORD@cluster0.abc123.mongodb.net/snapgram?retryWrites=true&w=majority
   ```
   ✅ Save this as `MONGODB_URI`

---

### 1B. Cloudinary (Image Storage)

1. Go to https://cloudinary.com → sign up/in
2. From the **Dashboard** page, copy these 3 values:
   - **Cloud Name** → `CLOUDINARY_CLOUD_NAME`
   - **API Key** → `CLOUDINARY_API_KEY`
   - **API Secret** → `CLOUDINARY_API_SECRET`

---

### 1C. Gmail App Password (Email)

1. Go to https://myaccount.google.com
2. Click **Security** in the left menu
3. Make sure **2-Step Verification** is ON (enable it if not)
4. Search **"App passwords"** → click it
5. At the bottom, click **"Select app"** → choose **"Other"** → type `SnapGram`
6. Click **"Generate"** → Google shows a **16-character password**
7. Copy it (you won't see it again): `xxxx xxxx xxxx xxxx`
8. Remove spaces: `xxxxxxxxxxxxxxxx`
   ✅ Save as: `MAIL_PASSWORD`
   ✅ Your Gmail address is: `MAIL_USERNAME`

---

### 1D. Generate JWT Secret

Run this in your terminal to generate a secure random secret:

**Mac/Linux:**
```bash
openssl rand -hex 32
```

**Windows (PowerShell):**
```powershell
-join ((48..57) + (97..102) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

**Online:** https://generate-secret.vercel.app/64

✅ Save the output as `JWT_SECRET`

---

## PHASE 2: UPLOAD TO GITHUB

### Step 1: Install Git (if not already installed)

Check if installed:
```bash
git --version
```

If not installed: https://git-scm.com/downloads

### Step 2: Configure Git (first time only)

```bash
git config --global user.name "Your Name"
git config --global user.email "your.email@gmail.com"
```

### Step 3: Create GitHub repository

1. Go to https://github.com → click the **"+"** in top right → **"New repository"**
2. Name it: `snapgram` (or any name you prefer)
3. Set to **Public** or **Private** (both work)
4. **Do NOT** check "Add README", "Add .gitignore", or "Choose license"
   (our project already has these)
5. Click **"Create repository"**
6. Copy the repository URL shown — it looks like:
   ```
   https://github.com/YOUR_USERNAME/snapgram.git
   ```

### Step 4: Initialize and push the project

Open your terminal, navigate to where you unzipped the project:

```bash
# Navigate to the project root
cd path/to/snapgram-clean

# Initialize Git
git init

# Add all files (the .gitignore will automatically exclude node_modules, .env, etc.)
git add .

# Check what will be committed (optional but recommended)
git status

# Create first commit
git commit -m "Initial commit — SnapGram social media app"

# Connect to GitHub (replace with YOUR repository URL)
git remote add origin https://github.com/YOUR_USERNAME/snapgram.git

# Push to GitHub
git branch -M main
git push -u origin main
```

**If asked for credentials:**
- Username: your GitHub username
- Password: use a GitHub Personal Access Token (not your GitHub password)
  - Create one: GitHub → Settings → Developer settings → Personal access tokens → Generate new token
  - Select scopes: `repo` → Generate → copy the token

✅ Your code is now on GitHub!

---S

## PHASE 3: DEPLOY BACKEND TO RENDER

### Step 1: Create Render account

Go to https://render.com → **"Sign up"** → choose **"Sign up with GitHub"**
(connecting via GitHub makes it easy to deploy)

### Step 2: Create new Web Service

1. Click **"New"** → **"Web Service"**
2. Click **"Connect account"** if not connected to GitHub
3. Find your `snapgram` repository → click **"Connect"**

### Step 3: Configure the service

Fill in these settings EXACTLY:

| Setting | Value |
|---------|-------|
| **Name** | `snapgram-backend` |
| **Region** | Oregon (US West) — or closest to you |
| **Branch** | `main` |
| **Root Directory** | *(leave empty)* |
| **Runtime** | `Java` |
| **Build Command** | `cd backend && mvn clean package -DskipTests` |
| **Start Command** | `java -jar backend/target/snapgram-backend.jar` |
| **Instance Type** | `Free` |

### Step 4: Add Environment Variables

Scroll down to **"Environment Variables"** section.
Click **"Add Environment Variable"** for EACH of these:

| Key | Value |
|-----|-------|
| `JAVA_VERSION` | `17` |
| `MONGODB_URI` | *(your Atlas connection string)* |
| `JWT_SECRET` | *(your 32+ char random string)* |
| `CLOUDINARY_CLOUD_NAME` | *(from Cloudinary dashboard)* |
| `CLOUDINARY_API_KEY` | *(from Cloudinary dashboard)* |
| `CLOUDINARY_API_SECRET` | *(from Cloudinary dashboard)* |
| `MAIL_USERNAME` | *(your Gmail address)* |
| `MAIL_PASSWORD` | *(your Gmail App Password, no spaces)* |
| `FRONTEND_URL` | `http://localhost:5173` ← temporary, update after Vercel |
| `BASE_URL` | *(will be your Render URL — see below)* |

For `BASE_URL`: leave it empty for now and add it after deployment.

### Step 5: Deploy

Click **"Create Web Service"**

Render will:
1. Clone your GitHub repo
2. Install Java 17
3. Run `cd backend && mvn clean package -DskipTests` (~3-5 minutes)
4. Start the server with `java -jar backend/target/snapgram-backend.jar`

### Step 6: Verify deployment

Watch the logs in Render. Look for:
```
Started SnapgramApplication in 8.xxx seconds
```

Then test the health endpoint:
```bash
curl https://snapgram-backend.onrender.com/actuator/health
# Expected: {"status":"UP"}
```

✅ Your Render URL is: `https://snapgram-backend.onrender.com`

### Step 7: Update BASE_URL

Go back to Render → your service → **Environment** → add:
- Key: `BASE_URL`
- Value: `https://snapgram-backend.onrender.com`

Click **"Save Changes"** → Render redeploys automatically.

---

## PHASE 4: DEPLOY FRONTEND TO VERCEL

### Option A: Deploy via Vercel CLI (Recommended)

#### Install Vercel CLI
```bash
npm install -g vercel
```

#### Deploy
```bash
# Navigate into the frontend folder
cd path/to/snapgram-clean/frontend

# Login to Vercel (opens browser)
vercel login

# Deploy (follow the prompts)
vercel
```

**Answer the prompts like this:**
```
? Set up and deploy "snapgram-clean/frontend"? → Yes
? Which scope? → (select your account)
? Link to existing project? → No
? What's your project's name? → snapgram
? In which directory is your code located? → ./ (current dir, just press Enter)
? Want to modify these settings? → No
```

Vercel will deploy and give you a URL like:
`https://snapgram-xxxxx.vercel.app`

#### Add Production Environment Variables
```bash
# Add API URL (replace with your actual Render URL)
vercel env add VITE_API_URL production
# When prompted, enter: https://snapgram-backend.onrender.com/api

vercel env add VITE_WS_URL production
# When prompted, enter: wss://snapgram-backend.onrender.com/ws

# Redeploy with the env vars
vercel --prod
```

#### Your production URL
```
https://snapgram.vercel.app
```
(or whatever name you chose)

---

### Option B: Deploy via Vercel Dashboard

1. Go to https://vercel.com → **"Add New"** → **"Project"**
2. Click **"Import Git Repository"** → select your `snapgram` repo
3. Configure:

| Setting | Value |
|---------|-------|
| **Framework Preset** | `Vite` |
| **Root Directory** | `frontend` ← IMPORTANT |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |

4. Expand **"Environment Variables"** and add:

| Name | Value |
|------|-------|
| `VITE_API_URL` | `https://snapgram-backend.onrender.com/api` |
| `VITE_WS_URL` | `wss://snapgram-backend.onrender.com/ws` |

5. Click **"Deploy"**

✅ Frontend is live!

---

## PHASE 5: CONNECT FRONTEND AND BACKEND

### Update CORS on Render

Now that you have your Vercel URL, update the backend CORS config:

1. Go to Render → your service → **Environment**
2. Update `FRONTEND_URL` from `http://localhost:5173` to your Vercel URL:
   ```
   FRONTEND_URL=https://snapgram.vercel.app
   ```
3. Click **"Save Changes"** — Render redeploys automatically (~2 minutes)

### Test the connection

Open your Vercel app URL in browser. Try:
1. Click **"Sign Up"** → fill in details → submit
2. Check email for verification link
3. Click verification link → should redirect to app
4. Try logging in → should land on feed

---

## PHASE 6: FUTURE UPDATES

When you change code and want to redeploy:

```bash
# Make your changes
git add .
git commit -m "Description of what you changed"
git push origin main
```

**Both Render and Vercel detect the GitHub push and automatically redeploy!**
No manual deploy needed — just push to GitHub.

---

## TROUBLESHOOTING

### ❌ Render build fails: "Could not find Java 17"
**Fix:** Make sure you added `JAVA_VERSION=17` in Render environment variables.

### ❌ Render build fails: "mvn: not found"
**Fix:** Render provides Maven for Java projects. Make sure **Runtime** is set to `Java`, not `Node`.

### ❌ App starts but immediately crashes
**Fix:** Check Render logs for the error. Usually it's a missing environment variable.
- Run: look for "Could not resolve placeholder" errors
- Solution: Add the missing env var in Render dashboard

### ❌ "MongoTimeoutException" in Render logs
**Fix:** 
1. Check `MONGODB_URI` is correctly set in Render env vars
2. Go to MongoDB Atlas → Network Access → make sure `0.0.0.0/0` is in the allowlist
3. Make sure your Atlas cluster is running (not paused)

### ❌ Frontend loads but API calls fail (CORS error in browser console)
**Fix:**
1. In Render, check `FRONTEND_URL` is set to your exact Vercel URL (no trailing slash)
2. Example: `https://snapgram.vercel.app` ✓
3. Example: `https://snapgram.vercel.app/` ✗ (no trailing slash!)
4. After updating, wait for Render to redeploy

### ❌ "Failed to fetch" or network error
**Fix:** Check that `VITE_API_URL` in Vercel env vars points to the correct Render URL.
- Should be: `https://snapgram-backend.onrender.com/api`
- Make sure it ends in `/api`

### ❌ Images not uploading
**Fix:** Check Cloudinary env vars in Render:
- `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`
- Get them from: cloudinary.com → Dashboard

### ❌ Email verification not working
**Fix:**
1. Check `MAIL_USERNAME` and `MAIL_PASSWORD` in Render
2. `MAIL_PASSWORD` must be a Gmail **App Password** (16 chars, no spaces)
3. Make sure 2-Step Verification is enabled on your Google account
4. Check `FRONTEND_URL` — the verification email links use this URL

### ❌ Render free tier: first request is slow (30+ seconds)
**Explanation:** Render free tier spins down after 15 minutes of inactivity.
**Fix:** Add a free uptime monitor (e.g., UptimeRobot) to ping `/actuator/health` every 14 minutes.
- Sign up at https://uptimerobot.com
- Add monitor → HTTP(S) → URL: `https://snapgram-backend.onrender.com/actuator/health`
- Interval: 5 minutes

### ❌ Vercel: "Page not found" when refreshing a URL
**Fix:** The `vercel.json` already handles this with SPA rewrites. If you see this, make sure `vercel.json` is in the `frontend/` directory and Vercel is using `frontend/` as root.

### ❌ WebSocket not connecting in production
**Fix:** Check `VITE_WS_URL` in Vercel env vars:
- Should use `wss://` (not `ws://`) for HTTPS backends
- Should be: `wss://snapgram-backend.onrender.com/ws`

---

## QUICK REFERENCE

### All URLs after deployment:

| Service | URL |
|---------|-----|
| Frontend (Vercel) | `https://snapgram.vercel.app` |
| Backend (Render) | `https://snapgram-backend.onrender.com` |
| Backend Health | `https://snapgram-backend.onrender.com/actuator/health` |
| API Base | `https://snapgram-backend.onrender.com/api` |

### All environment variables:

**Render (Backend):**
```
JAVA_VERSION=17
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...
MAIL_USERNAME=yourapp@gmail.com
MAIL_PASSWORD=xxxxxxxxxxxxxxxx
FRONTEND_URL=https://snapgram.vercel.app
BASE_URL=https://snapgram-backend.onrender.com
```

**Vercel (Frontend):**
```
VITE_API_URL=https://snapgram-backend.onrender.com/api
VITE_WS_URL=wss://snapgram-backend.onrender.com/ws
```

### Redeployment commands:
```bash
# Push changes → both services auto-redeploy
git add .
git commit -m "your change description"
git push origin main
```

---

*SnapGram — Built with Spring Boot + React | Deployed on Render + Vercel*
