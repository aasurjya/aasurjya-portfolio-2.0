# Portfolio User Flow

## Landing Page (/)
**Initial Experience**
- User lands on the portfolio
- Preloader displays with percentage counter (0-100%)
- After loading completes, hero selection screen appears
- **No scrolling allowed** - viewport is locked to full screen
- **No navigation header** - clean, distraction-free experience

### Hero Selection Screen
Three interactive categories displayed in a grid:
1. **FULLSTACK** (Left) - SaaS & Cloud
2. **XR DEV** (Center) - Immersive Tech
3. **RESEARCH** (Right) - Academic & HCI

**Behavior:**
- Hover effects on each category with color-coded backgrounds
- No "Active" indicator shown
- Clicking a category triggers:
  1. Mode is set in context
  2. User is redirected to the category-specific page
  3. Scrolling is re-enabled
  4. Navigation header appears

---

## Category Pages

### /fullstack
**Route:** `http://localhost:3002/fullstack`
- Mode: `fullstack`
- Theme: Professional blue/green palette
- Navigation visible with mode indicator
- Sections displayed in order:
  1. About (Full Stack Engineer & Solution Architect)
  2. Resume (Experience & Education tailored for engineering)
  3. Projects (filtered for fullstack)
  4. Skills (fullstack-specific)
  5. Contact

### /xr-dev
**Route:** `http://localhost:3002/xr-dev`
- Mode: `xr`
- Theme: Neon teal/purple palette (futuristic)
- Navigation visible with mode indicator
- Sections displayed in order:
  1. About (XR Developer & Creative Technologist)
  2. Resume (Experience & Education tailored for XR)
  3. Projects (filtered for XR)
  4. Skills (XR-specific)
  5. Contact

### /research
**Route:** `http://localhost:3002/research`
- Mode: `phd`
- Theme: Academic blue palette
- Navigation visible with mode indicator
- Sections displayed in order:
  1. About (PhD Researcher in HCI)
  2. Resume (Experience & Education tailored for Research/HCI)
  3. Projects (filtered for research)
  4. Publications (PhD-exclusive section)
  5. Skills (research-specific)
  6. Contact

---

## Navigation Features

### Header Elements
- **Logo** with mode badge (e.g., "FULLSTACK")
- **Navigation Links** (visible only on category pages):
  - About
  - Projects
  - Publications (PhD mode only)
  - Skills
  - Contact
- **Switch Mode Button** - returns to landing page (/)
- **Theme Toggle** - light/dark mode

### Behavior
- Navigation is **hidden on landing page** (/)
- Navigation **appears on all category pages** (/fullstack, /xr-dev, /research)
- Clicking "Switch Mode" clears the mode and redirects to /
- Smooth scroll to sections via anchor links

---

## Data Persistence

### Mode Storage
- Selected mode is stored in `localStorage` as `portfolio-mode`
- If user returns to a category page directly, mode is restored
- Landing page does not set a default mode

### Analytics Tracking
- Visitor IP and geolocation tracked on page load
- Mode selection tracked when user clicks a category
- Data stored in MongoDB Atlas

---

## Visual Design

### Color Schemes

**Fullstack Mode**
- Primary: Professional Blue (#199 89% 48%)
- Accent: Success Green (#142 71% 45%)
- Background: Dark Blue (#222 47% 11%)

**XR Dev Mode**
- Primary: Neon Teal (#165 100% 50%)
- Accent: Cyber Purple (#280 100% 60%)
- Background: Deep Black (#240 10% 4%)

**Research Mode**
- Primary: Academic Blue (#221 83% 53%)
- Accent: Academic Blue
- Background: Light Gray (#210 20% 98%)

### Typography
- **Headings:** Bold, high contrast
- **Body:** Clean, readable sans-serif
- **Research Mode:** Optional serif font for academic feel

---

## Animations

### Landing Page
- Preloader: Smooth percentage counter with progress bar
- Hero Text: Split animation (AASURJYA slides left, HANDIQUE slides right)
- Category Cards: Staggered fade-in with hover effects

### Category Pages
- Page Transition: Fade-in animation on route change
- Section Entrance: Scroll-triggered animations (GSAP)
- 3D Avatar: Mode-specific physics and colors

---

## Mobile Responsiveness

- Landing page: Full-screen hero selection (responsive grid)
- Category pages: Mobile-optimized navigation with hamburger menu
- Touch-friendly interactive elements
- Optimized font sizes for mobile viewing

---

## Summary

**User Journey:**
1. Land on `/` → See preloader → Hero selection screen (no scroll)
2. Click category → Set mode → Navigate to `/fullstack`, `/xr-dev`, or `/research`
3. View tailored content with mode-specific theming
4. Click "Switch Mode" → Return to `/` → Repeat

**Key Principles:**
- Clean, focused landing experience
- No distractions or unnecessary elements on selection screen
- Immediate visual feedback on category selection
- Seamless transition to tailored content
- Easy mode switching via navigation header
