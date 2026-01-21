# Website Customization Guide

## 📝 Part 1: Change Website Title & Description

### 1. Main Site Title

**File:** `src/data/app.json`

```json
{
    "settings": {
        "siteName": "Ashley",  ← Change this to your site name
        ...
    }
}
```

**What it affects:**
- Browser tab title
- Page titles (format: "SiteName - Page Title")
- Used in: `src/pages/_app.js` line 17

### 2. Add Meta Description

**File:** `src/pages/_document.js` or `src/pages/_app.js`

Currently, there's no meta description. Add it here:

**Option A: Add to `_app.js` (recommended for dynamic):**
```javascript
<Head>
    <title>{AppData.settings.siteName}</title>
    <meta name="description" content="Your website description here" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</Head>
```

**Option B: Add to `_document.js` (for static):**
```javascript
<Head>
    <meta charSet="UTF-8" />
    <meta httpEquiv="X-UA-Compatible" content="ie=edge" />
    <meta name="description" content="Your website description here" />
</Head>
```

### 3. Page-Specific Titles

**File:** `src/components/PageBanner.jsx` (line 20)

Each page can have its own title. For example:
- Homepage: Set in `src/pages/index.jsx`
- Blog: Set in `src/pages/blog.jsx`
- Projects: Set in `src/pages/projects.jsx`

---

## 🖼️ Part 2: How to Change Images

### Image Locations

All images are stored in: **`public/img/`**

```
public/img/
├── blog/          → Blog post images
├── faces/         → Team/people photos
├── icons/         → Icons (zoom.svg, etc.)
├── partners/      → Partner logos
├── photo/         → General photos
└── works/         → Portfolio/work images
    ├── 1/         → Project 1 images
    ├── 2/         → Project 2 images
    └── ...
```

### How Images Are Used

#### 1. **Section Images** (Hero, About, etc.)

**File:** `src/data/sections/about.json`
```json
{
    "image": {
        "url": "/img/photo/1.jpg",  ← Change this path
        "alt": "About image"
    }
}
```

**Files to check:**
- `src/data/sections/about.json`
- `src/data/sections/hero-1.json`
- `src/data/sections/hero-2.json`
- Other files in `src/data/sections/`

#### 2. **Project/Portfolio Images**

**File:** `src/data/projects/project-1.md` (and project-2.md, etc.)

```markdown
---
title: "Project Title"
image: "/img/works/1.jpg"        ← Main project image
fullImage: "/img/works/1/1.jpg"  ← Full size image
gallery:
  enabled: 1
  items:
    - image: "/img/works/1/1.jpg"  ← Gallery images
      alt: "Image 1"
    - image: "/img/works/1/2.jpg"
      alt: "Image 2"
---
```

**To change project images:**
1. Replace images in `public/img/works/[project-number]/`
2. Update the paths in the markdown file

#### 3. **Blog Post Images**

**File:** `src/data/posts/[post-name].md`

```markdown
---
title: "Blog Post Title"
image: "/img/blog/1.jpg"  ← Change this
---
```

**To change:**
1. Replace image in `public/img/blog/`
2. Update path in markdown file

#### 4. **Team/People Images**

**File:** `src/data/sections/team.json` or individual pages

```json
{
    "avatar": {
        "image": "/img/faces/1.jpg",  ← Change this
        "alt": "Person name"
    }
}
```

### Step-by-Step: Replacing an Image

**Example: Replace homepage hero image**

1. **Find the current image:**
   - Check `src/data/sections/hero-1.json`
   - See what image path is used

2. **Add your new image:**
   - Place it in `public/img/photo/` (or appropriate folder)
   - Name it something like `hero-new.jpg`

3. **Update the reference:**
   - Open `src/data/sections/hero-1.json`
   - Change the path: `"url": "/img/photo/hero-new.jpg"`

4. **Save and deploy:**
   - Commit changes
   - Push to GitHub
   - Vercel will auto-deploy

### Image Best Practices

1. **File Formats:**
   - Use `.jpg` for photos
   - Use `.png` for graphics with transparency
   - Use `.webp` for better compression (optional)

2. **File Sizes:**
   - Optimize images before uploading
   - Recommended: 1920px width max for hero images
   - Use tools like: TinyPNG, ImageOptim, or Squoosh

3. **Naming:**
   - Use descriptive names: `hero-main.jpg` not `img1.jpg`
   - Keep original names if replacing existing images

4. **Organization:**
   - Keep related images in the same folder
   - Project images: `public/img/works/[project-number]/`

---

## 📋 Quick Reference

### Files to Edit for Common Changes:

| What to Change | File Location |
|---------------|---------------|
| Site Name | `src/data/app.json` → `settings.siteName` |
| Meta Description | `src/pages/_app.js` or `src/pages/_document.js` |
| Header Logo | `src/data/app.json` → `header.logo.symbol` |
| Footer Text | `src/data/app.json` → `footer.copy` |
| Social Links | `src/data/app.json` → `social[]` |
| Hero Image | `src/data/sections/hero-1.json` |
| About Section Image | `src/data/sections/about.json` |
| Project Images | `src/data/projects/project-*.md` |
| Blog Images | `src/data/posts/*.md` |
| Team Photos | `src/data/sections/team.json` |

---

## 🚀 After Making Changes

1. **Test locally** (optional):
   ```bash
   npm run dev
   ```
   Visit `http://localhost:3000` to see changes

2. **Commit and push:**
   ```bash
   git add .
   git commit -m "Update site title and images"
   git push origin main
   ```

3. **Vercel auto-deploys:**
   - Changes will deploy automatically
   - Takes 2-3 minutes
   - Check Vercel dashboard for status

---

## 💡 Pro Tips

1. **Keep image dimensions consistent** for better layout
2. **Use alt text** for accessibility (already in place)
3. **Test on mobile** after changing images
4. **Use Next.js Image component** for automatic optimization (already configured)
5. **Backup original images** before replacing

---

## Need Help?

- **Image not showing?** Check the path starts with `/img/`
- **Title not updating?** Clear browser cache
- **Changes not deploying?** Check Vercel build logs
