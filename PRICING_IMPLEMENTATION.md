# Service-Specific Pricing Implementation

## What Was Changed

I've implemented service-specific pricing so each service (Branding, Web, Ads, Consultant) can have its own unique pricing plans.

---

## Files Modified

### 1. Service Markdown Files (Added Pricing Data)

**Files:**
- `src/data/services/service-1.md` (Branding)
- `src/data/services/service-2.md` (Web)
- `src/data/services/service-3.md` (Ads)
- `src/data/services/service-4.md` (Consultant)

**What Changed:**
- Added `pricing:` section to the frontmatter of each service file
- Each service now has its own pricing structure with:
  - Custom title and description
  - 4 pricing tiers specific to that service
  - Service-appropriate button text

**Pricing Structure Added:**
```yaml
pricing:
  title: "Service-specific title"
  description: "Service-specific description"
  items:
    - title: "Plan name"
      text: "Plan description"
      price:
        value: "500"
        symbol: "$"
      link: "/contact"
  button:
    label: "Button text"
    link: "/contact"
```

---

### 2. Pricing Component (Made Flexible)

**File:** `src/components/sections/Pricing.jsx`

**What Changed:**
- Component now accepts `pricingData` as a prop
- Falls back to default pricing if no service-specific pricing is provided
- Handles "Custom" pricing (no currency symbol) gracefully

**Before:**
```javascript
const PricingSection = () => {
    const Data = DefaultData; // Always used default
```

**After:**
```javascript
const PricingSection = ({ pricingData = null }) => {
    const Data = pricingData || DefaultData; // Uses service-specific or default
```

---

### 3. Service Detail Page (Passes Pricing Data)

**File:** `src/pages/services/[id].jsx`

**What Changed:**
- Now passes service-specific pricing data to PricingSection component
- Only shows pricing if the service has pricing data defined

**Before:**
```javascript
<PricingSection /> // Always showed default pricing
```

**After:**
```javascript
{postData.pricing && <PricingSection pricingData={postData.pricing} />}
// Shows service-specific pricing if available
```

---

## Pricing Details by Service

### 1. Branding (service-1.md)
- **Starting:** $500 (Essential Branding)
- **Tiers:** $500 → $1,500 → $3,500 → $5,000
- **Focus:** Complexity-based pricing

### 2. Web Development (service-2.md)
- **Starting:** $700 (Essential Website)
- **Tiers:** $700 → $2,000 → $5,000 → $8,000
- **Focus:** Complexity and features

### 3. Advertising (service-3.md)
- **Starting:** $500 (Starter Campaign)
- **Tiers:** $500 → $2,000 → $5,000 → $10,000
- **Focus:** Target audience and campaign scope

### 4. Consulting (service-4.md)
- **Starting:** $300 (Strategy Overview)
- **Tiers:** $300 → $1,000 → $2,500 → Custom
- **Focus:** Plan, overview, and strategy discussion

---

## How It Works

1. **Service Page Loads** (`/services/[id]`)
   - Reads service markdown file
   - Extracts pricing data from frontmatter

2. **Pricing Component Receives Data**
   - If service has pricing → uses service-specific pricing
   - If no pricing → falls back to default `pricing.json`

3. **Display**
   - Shows service-appropriate pricing plans
   - Each service has unique titles, descriptions, and prices

---

## Benefits

✅ **Service-Specific:** Each service shows relevant pricing  
✅ **Flexible:** Easy to update individual service pricing  
✅ **Backward Compatible:** Still works if pricing not defined  
✅ **Professional:** Human-written, natural descriptions  
✅ **Scalable:** Easy to add more pricing tiers or services  

---

## Testing

After deployment, test each service page:
- `/services/service-1` → Should show Branding pricing ($500+)
- `/services/service-2` → Should show Web pricing ($700+)
- `/services/service-3` → Should show Ads pricing ($500+)
- `/services/service-4` → Should show Consultant pricing ($300+)

---

## Future Updates

To change pricing for a specific service:
1. Edit the service markdown file (`src/data/services/service-X.md`)
2. Update the `pricing:` section
3. Commit and push
4. Vercel will auto-deploy

No need to touch component or page files!
