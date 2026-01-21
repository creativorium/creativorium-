# Domain Setup & Asset Configuration Guide

## Current Status
- ✅ Project: `creativorium-website` 
- ✅ Region: `asia-southeast1` (Singapore - cheapest)
- ✅ Service: `portfolio`
- ⏳ Deployment: In progress (permission issues being resolved)

---

## Part 1: Assets & Images

### How Assets Work in Next.js
Your Next.js app automatically handles assets:

1. **Images in `/public/img/` folder** - These are automatically served at the root URL
   - Example: `/public/img/photo/1.jpg` → accessible at `https://yourdomain.com/img/photo/1.jpg`
   - ✅ All your images are already in the project and will be deployed

2. **No Database Needed** - Your portfolio is static content:
   - Blog posts: Markdown files in `/src/data/posts/`
   - Projects: Markdown files in `/src/data/projects/`
   - Services: Markdown files in `/src/data/services/`
   - All content is built at deployment time (SSG - Static Site Generation)

3. **Performance Optimization**:
   - Next.js automatically optimizes images
   - Static files are served from Cloud Run's CDN
   - All assets are included in the Docker image

### Asset Locations in Your Project:
```
public/
  ├── img/
  │   ├── blog/          → /img/blog/
  │   ├── faces/         → /img/faces/
  │   ├── icons/         → /img/icons/
  │   ├── partners/      → /img/partners/
  │   ├── photo/         → /img/photo/
  │   └── works/         → /img/works/
  └── css/               → /css/
```

**✅ All assets are already included and will be deployed automatically!**

---

## Part 2: Pointing Your Hostinger Domain to Google Cloud Run

### Step 1: Get Your Cloud Run URL
After deployment completes, you'll get a URL like:
```
https://portfolio-xxxxx-xx.a.run.app
```

### Step 2: Configure DNS in Hostinger

1. **Log into Hostinger** → Go to your domain's DNS settings

2. **Add/Update DNS Records**:

   **Option A: Using CNAME (Recommended for subdomain like www)**
   ```
   Type: CNAME
   Name: www (or @ for root domain)
   Points to: portfolio-xxxxx-xx.a.run.app
   TTL: 3600
   ```

   **Option B: Using A Record (For root domain)**
   ```
   Type: A
   Name: @
   Points to: [Cloud Run IP - we'll get this after deployment]
   TTL: 3600
   ```

### Step 3: Map Custom Domain in Google Cloud Run

After your service is deployed, run:
```bash
gcloud run domain-mappings create \
  --service=portfolio \
  --domain=yourdomain.com \
  --region=asia-southeast1
```

Or for www subdomain:
```bash
gcloud run domain-mappings create \
  --service=portfolio \
  --domain=www.yourdomain.com \
  --region=asia-southeast1
```

### Step 4: Verify Domain Ownership
Google will provide DNS verification records. Add them to Hostinger:
```
Type: TXT
Name: @
Value: [verification code from Google]
```

### Step 5: Update DNS Records
After verification, Google will provide the final DNS records:
```
Type: A
Name: @
Points to: [IP addresses from Google]
```

---

## Part 3: Performance Optimization

### Current Setup (Already Optimized):
- ✅ Static Site Generation (SSG) - fastest loading
- ✅ Images optimized by Next.js
- ✅ Assets served from Cloud Run CDN
- ✅ Minimal resource usage (512Mi memory, 1 CPU)

### Additional Optimizations (Optional):

1. **Cloud CDN** (for even faster asset delivery):
   ```bash
   gcloud compute backend-buckets create portfolio-assets \
     --gcs-bucket-name=your-bucket-name
   ```

2. **Image Optimization**:
   - Next.js Image component already optimizes images
   - Consider using WebP format for better compression

3. **Caching Headers**:
   - Already configured in Next.js
   - Static assets cached automatically

---

## Part 4: Database (If Needed Later)

**Current Setup: No Database Required** ✅
- All content is in Markdown files
- Built at deployment time
- No database queries needed

**If You Need a Database Later:**
- **Cloud SQL** (PostgreSQL/MySQL) - for dynamic content
- **Firestore** - NoSQL database (cheaper, easier)
- **Cloud Storage** - for file uploads

---

## Quick Checklist

- [ ] Complete Cloud Run deployment
- [ ] Get Cloud Run service URL
- [ ] Configure DNS in Hostinger
- [ ] Map custom domain in Cloud Run
- [ ] Verify domain ownership
- [ ] Test website at custom domain
- [ ] Verify all images/assets load correctly

---

## Cost Optimization (Current Setup)

- **Region**: asia-southeast1 (Singapore) - Lower costs
- **Memory**: 512Mi (minimum)
- **CPU**: 1 (minimum)
- **Min Instances**: 0 (scales to zero when not in use)
- **Max Instances**: 1 (limits costs)
- **Estimated Cost**: ~$0-5/month for low traffic

---

## Need Help?

- Cloud Run Domain Mapping: https://cloud.google.com/run/docs/mapping-custom-domains
- Hostinger DNS Guide: https://www.hostinger.com/tutorials/how-to-change-dns-nameservers
- Next.js Asset Optimization: https://nextjs.org/docs/basic-features/static-file-serving
