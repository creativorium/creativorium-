# Deployment Guide: GitHub & Google Hosting

This guide will walk you through uploading your code to GitHub and deploying it to Google hosting.

## Part 1: Upload to GitHub

### Step 1: Check Current Status
Your repository is already initialized and connected to: `git@github.com:creativorium/creativorium--git.git`

### Step 2: Stage and Commit Your Changes
```bash
# Add all changes (excluding files in .gitignore)
git add .

# Commit your changes
git commit -m "Update portfolio project"

# Push to GitHub
git push origin main
```

### Step 3: If You Want to Create a New Repository
If you want to use a different GitHub repository:

1. Create a new repository on GitHub (don't initialize with README)
2. Update the remote:
```bash
git remote set-url origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
# OR if using SSH:
git remote set-url origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```
3. Push your code:
```bash
git push -u origin main
```

---

## Part 2: Deploy to Google Hosting

For Next.js applications, Google offers several hosting options. Here are the most common:

### Option A: Google Cloud Run (Recommended for Next.js)

**Prerequisites:**
- Google Cloud account
- Google Cloud SDK installed
- Billing enabled on your Google Cloud project

**Steps:**

1. **Install Google Cloud SDK** (if not already installed):
   - Download from: https://cloud.google.com/sdk/docs/install

2. **Create a Dockerfile** (already created in this project):
   ```dockerfile
   FROM node:18-alpine AS base
   
   # Install dependencies only when needed
   FROM base AS deps
   RUN apk add --no-cache libc6-compat
   WORKDIR /app
   COPY package.json package-lock.json ./
   RUN npm ci
   
   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Production image
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   RUN addgroup --system --gid 1001 nodejs
   RUN adduser --system --uid 1001 nextjs
   
   COPY --from=builder /app/public ./public
   COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
   COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
   
   USER nextjs
   EXPOSE 3000
   ENV PORT 3000
   
   CMD ["node", "server.js"]
   ```

3. **Update next.config.js** for standalone output:
   ```javascript
   const nextConfig = {
     reactStrictMode: true,
     output: 'standalone'
   }
   ```

4. **Deploy to Cloud Run:**
   ```bash
   # Authenticate
   gcloud auth login
   
   # Set your project
   gcloud config set project YOUR_PROJECT_ID
   
   # Build and deploy
   gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ashley-portfolio
   gcloud run deploy ashley-portfolio \
     --image gcr.io/YOUR_PROJECT_ID/ashley-portfolio \
     --platform managed \
     --region us-central1 \
     --allow-unauthenticated
   ```

### Option B: Firebase Hosting (Easier, but requires static export)

**Prerequisites:**
- Firebase account
- Firebase CLI installed: `npm install -g firebase-tools`

**Steps:**

1. **Update next.config.js** for static export:
   ```javascript
   const nextConfig = {
     reactStrictMode: true,
     output: 'export',
     images: {
       unoptimized: true
     }
   }
   ```

2. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

3. **Login and Initialize:**
   ```bash
   firebase login
   firebase init hosting
   ```
   - Select your Firebase project
   - Set public directory to: `out`
   - Configure as single-page app: Yes
   - Set up automatic builds: No (for now)

4. **Build and Deploy:**
   ```bash
   npm run build
   firebase deploy
   ```

### Option C: Google App Engine

**Prerequisites:**
- Google Cloud account
- Google Cloud SDK installed

**Steps:**

1. **Create app.yaml** (already created in this project):
   ```yaml
   runtime: nodejs18
   
   env: standard
   
   instance_class: F1
   
   automatic_scaling:
     min_instances: 0
     max_instances: 1
   
   handlers:
     - url: /.*
       script: auto
   ```

2. **Deploy:**
   ```bash
   gcloud app deploy
   ```

---

## Quick Start Commands

### For GitHub:
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### For Google Cloud Run (Recommended):
```bash
# First time setup
gcloud auth login
gcloud config set project YOUR_PROJECT_ID

# Deploy
gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/ashley-portfolio
gcloud run deploy ashley-portfolio --image gcr.io/YOUR_PROJECT_ID/ashley-portfolio --platform managed --region us-central1 --allow-unauthenticated
```

### For Firebase Hosting:
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

---

## Notes

- **Environment Variables**: If you need environment variables, set them in your hosting platform's console
- **Custom Domain**: All Google hosting options support custom domains
- **Costs**: 
  - Cloud Run: Pay per use (free tier available)
  - Firebase Hosting: Free tier with generous limits
  - App Engine: Free tier available

---

## Need Help?

- Google Cloud Run: https://cloud.google.com/run/docs
- Firebase Hosting: https://firebase.google.com/docs/hosting
- Google App Engine: https://cloud.google.com/appengine/docs
