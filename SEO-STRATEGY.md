# Comprehensive SEO Strategy for aasurjya.in

## Portfolio Overview
- **Domain**: https://www.aasurjya.in
- **Niche**: HCI Researcher | XR Developer | Full Stack Engineer
- **Tech Stack**: Next.js 14, React, Three.js, TailwindCSS
- **Target Audience**: Recruiters, Tech Companies, Research Institutions, Collaborators

---

## 1. KEYWORD STRATEGY

### Primary Keywords (High Priority)
| Keyword | Search Intent | Monthly Volume (Est.) | Difficulty |
|---------|---------------|----------------------|------------|
| `XR developer portfolio` | Navigational | 500-1K | Medium |
| `AR VR developer India` | Commercial | 1K-2K | Medium |
| `full stack developer portfolio` | Navigational | 5K-10K | High |
| `HCI researcher portfolio` | Navigational | 200-500 | Low |
| `Unity developer India` | Commercial | 1K-2K | Medium |

### Secondary Keywords (Long-tail)
| Keyword | Page Target |
|---------|-------------|
| `augmented reality developer IIT` | /xr-dev |
| `virtual reality projects portfolio` | /xr-dev |
| `React Three Fiber developer` | /fullstack |
| `neuro-adaptive XR interfaces` | /research |
| `human computer interaction researcher India` | /research |
| `3D web developer portfolio` | /fullstack |
| `Gaussian splatting developer` | /xr-dev |
| `Flutter AR developer` | /xr-dev |
| `M.Tech AR VR IIT Jodhpur` | /story |

### Branded Keywords
- `Aasurjya Bikash Handique`
- `Aasurjya portfolio`
- `Aasurjya developer`

### LSI (Latent Semantic Indexing) Keywords
- immersive technology, spatial computing, mixed reality
- WebGL, Three.js, React Three Fiber
- point cloud, 3D reconstruction
- user experience research, interaction design
- MongoDB, Node.js, TypeScript

---

## 2. ON-PAGE SEO BEST PRACTICES

### Title Tag Formula
```
[Primary Keyword] | [Secondary Keyword] - [Brand Name]
```

**Recommended Titles by Page:**
- **Home**: `Aasurjya - XR Developer & Full Stack Engineer Portfolio`
- **/xr-dev**: `AR/VR Developer Portfolio | XR Projects & Unity Development - Aasurjya`
- **/fullstack**: `Full Stack Developer Portfolio | React, Node.js, 3D Web - Aasurjya`
- **/research**: `HCI Researcher | Neuro-Adaptive XR Interfaces - Aasurjya`
- **/story**: `My Journey: From Assam to IIT Jodhpur | Aasurjya's Story`

### Meta Description Guidelines
- **Length**: 150-160 characters
- **Include**: Primary keyword, value proposition, call-to-action
- **Tone**: Professional yet personal

**Recommended Descriptions:**
- **Home**: `Explore the portfolio of Aasurjya - HCI Researcher, XR Developer & Full Stack Engineer at IIT Jodhpur. Building immersive AR/VR experiences and scalable web applications.`
- **/xr-dev**: `Discover AR/VR projects by Aasurjya - Unity, Unreal, Flutter AR development. Specializing in Gaussian splatting, neuro-adaptive interfaces & spatial computing.`
- **/fullstack**: `Full stack development portfolio featuring React, Next.js, Node.js & 3D web experiences. View projects, skills & contact Aasurjya for collaboration.`
- **/research**: `HCI research portfolio by Aasurjya at IIT Jodhpur. Publications on neuro-adaptive XR, human-computer interaction & immersive technology research.`

### Header Hierarchy (H1-H6)
- **One H1 per page** - Main topic/keyword
- **H2** - Major sections
- **H3** - Subsections
- Use keywords naturally in headers

### Content Optimization
- **Keyword density**: 1-2% (natural usage)
- **First 100 words**: Include primary keyword
- **Alt text**: Descriptive, keyword-rich for images
- **Internal links**: 3-5 per page minimum
- **External links**: Link to authoritative sources (GitHub, LinkedIn, publications)

---

## 3. TECHNICAL SEO SETUP

### robots.txt (Create at /public/robots.txt)
```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /api/

Sitemap: https://www.aasurjya.in/sitemap.xml
```

### XML Sitemap
Generate dynamically with Next.js or create static sitemap including:
- Homepage
- /xr-dev
- /fullstack
- /research
- /story
- All project pages (if any)

### Canonical URLs
- Set canonical tags for each page
- Prevent duplicate content issues
- Format: `<link rel="canonical" href="https://www.aasurjya.in/page" />`

### URL Structure
✅ Good: `/xr-dev`, `/fullstack`, `/research`
❌ Avoid: `/page?id=123`, `/category/subcategory/deep/page`

### HTTPS & Security
- Ensure SSL certificate is active
- Redirect HTTP to HTTPS
- Add security headers

---

## 4. IMAGE & MEDIA OPTIMIZATION

### Logo Optimization ("A" Logo)
1. **File formats**: 
   - SVG for scalability (primary)
   - PNG with transparency (fallback)
   - WebP for performance

2. **File naming**: `aasurjya-logo.svg`, `aasurjya-logo-dark.svg`

3. **Alt text**: `Aasurjya - XR Developer and Full Stack Engineer Logo`

4. **Structured data**: Include logo in Organization schema

5. **Favicon setup**:
   ```
   /public/favicon.ico (16x16, 32x32)
   /public/favicon-16x16.png
   /public/favicon-32x32.png
   /public/apple-touch-icon.png (180x180)
   /public/android-chrome-192x192.png
   /public/android-chrome-512x512.png
   ```

### General Image Guidelines
| Aspect | Recommendation |
|--------|----------------|
| Format | WebP (primary), PNG (fallback) |
| Compression | 80-85% quality |
| Lazy loading | Use Next.js Image component |
| Dimensions | Specify width/height to prevent CLS |
| Alt text | Descriptive, include keywords naturally |
| File names | `ar-vr-project-demo.webp` not `IMG_001.jpg` |

### Open Graph Images
- **Size**: 1200x630px
- **Format**: PNG or JPG
- **Include**: Brand name, tagline, visual identity
- Create unique OG images for each major page

---

## 5. STRUCTURED DATA / SCHEMA MARKUP

### Person Schema (Homepage)
```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Aasurjya Bikash Handique",
  "url": "https://www.aasurjya.in",
  "image": "https://www.aasurjya.in/profile-image.jpg",
  "jobTitle": ["XR Developer", "Full Stack Engineer", "HCI Researcher"],
  "worksFor": {
    "@type": "Organization",
    "name": "iHub Drishti, IIT Jodhpur"
  },
  "alumniOf": [
    {
      "@type": "CollegeOrUniversity",
      "name": "IIT Jodhpur",
      "department": "M.Tech AR/VR"
    },
    {
      "@type": "CollegeOrUniversity", 
      "name": "Tezpur University",
      "department": "B.Tech Computer Science"
    }
  ],
  "knowsAbout": ["Augmented Reality", "Virtual Reality", "Full Stack Development", "Human-Computer Interaction", "Unity", "React", "Next.js"],
  "sameAs": [
    "https://github.com/aasurjya",
    "https://linkedin.com/in/aasurjya",
    "https://twitter.com/aasurjya"
  ]
}
```

### WebSite Schema
```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Aasurjya Portfolio",
  "url": "https://www.aasurjya.in",
  "description": "Portfolio of Aasurjya - HCI Researcher, XR Developer & Full Stack Engineer",
  "author": {
    "@type": "Person",
    "name": "Aasurjya Bikash Handique"
  }
}
```

### BreadcrumbList Schema (for navigation)
```json
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {"@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.aasurjya.in"},
    {"@type": "ListItem", "position": 2, "name": "XR Development", "item": "https://www.aasurjya.in/xr-dev"}
  ]
}
```

---

## 6. CONTENT STRATEGY & BLOGGING

### Blog Topics (High SEO Value)
1. **Technical Tutorials**
   - "Building AR Experiences with Flutter & ARCore"
   - "Converting Point Clouds to Gaussian Splats: A Guide"
   - "React Three Fiber: Creating Immersive 3D Web Experiences"
   - "Neuro-Adaptive Interfaces: The Future of XR"

2. **Project Case Studies**
   - "How I Built [Project Name]: Technical Deep Dive"
   - "Lessons from Developing Multi-Tenant SaaS Platforms"

3. **Industry Insights**
   - "The State of XR Development in India 2024"
   - "HCI Research Trends: What's Next for Human-Computer Interaction"

4. **Career & Personal**
   - "From a Village Without WiFi to IIT: My Tech Journey"
   - "What I Learned from 8 Days at Annapurna Base Camp"

### Content Calendar Suggestions
| Month | Content Type | Topic |
|-------|--------------|-------|
| 1 | Tutorial | React Three Fiber basics |
| 1 | Case Study | Featured XR project |
| 2 | Tutorial | AR development with Flutter |
| 2 | Insight | XR industry trends |
| 3 | Case Study | Full stack project deep dive |
| 3 | Personal | Journey story expansion |

---

## 7. PERFORMANCE OPTIMIZATION

### Core Web Vitals Targets
| Metric | Target | Current Action |
|--------|--------|----------------|
| LCP (Largest Contentful Paint) | < 2.5s | Optimize hero images, preload fonts |
| FID (First Input Delay) | < 100ms | Minimize JS, defer non-critical scripts |
| CLS (Cumulative Layout Shift) | < 0.1 | Set image dimensions, avoid dynamic content injection |
| INP (Interaction to Next Paint) | < 200ms | Optimize event handlers |

### Performance Checklist
- [ ] Enable Next.js Image optimization
- [ ] Implement lazy loading for below-fold content
- [ ] Minify CSS/JS (automatic with Next.js)
- [ ] Enable Gzip/Brotli compression
- [ ] Use CDN for static assets
- [ ] Preload critical fonts
- [ ] Defer non-critical JavaScript
- [ ] Implement service worker for caching
- [ ] Optimize 3D assets (GLTF compression, LOD)

### Tools for Testing
- Google PageSpeed Insights
- GTmetrix
- WebPageTest
- Lighthouse (Chrome DevTools)

---

## 8. INTERNAL LINKING STRATEGY

### Link Structure
```
Homepage
├── /xr-dev (XR Development)
│   └── Individual project pages
├── /fullstack (Full Stack)
│   └── Individual project pages
├── /research (Research/PhD)
│   └── Publications
├── /story (Personal Journey)
└── /blog (Future)
    └── Individual posts
```

### Internal Linking Rules
1. **Every page links to homepage** (via logo/nav)
2. **Cross-link related content** (XR projects → relevant skills)
3. **Use descriptive anchor text** ("View my AR/VR projects" not "click here")
4. **Add contextual links in content** (mention a skill → link to projects using it)
5. **Footer links** to all major sections

---

## 9. XML SITEMAP & INDEXATION

### Sitemap Structure
```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://www.aasurjya.in/</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://www.aasurjya.in/xr-dev</loc>
    <lastmod>2024-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.9</priority>
  </url>
  <!-- Additional URLs -->
</urlset>
```

### Indexation Checklist
- [ ] Submit sitemap to Google Search Console
- [ ] Submit sitemap to Bing Webmaster Tools
- [ ] Request indexing for new/updated pages
- [ ] Monitor index coverage reports
- [ ] Fix any crawl errors promptly

---

## 10. BACKLINKING STRATEGY

### High-Value Backlink Sources
1. **GitHub Profile** - Link to portfolio in bio and READMEs
2. **LinkedIn** - Featured section, posts, articles
3. **Dev.to / Medium / Hashnode** - Technical articles with portfolio links
4. **Stack Overflow** - Profile link
5. **Research Publications** - Author profile links
6. **IIT Jodhpur** - Student/researcher profile
7. **iHub Drishti** - Team page link
8. **Conference Presentations** - Speaker bio links
9. **Guest Posts** - XR/tech blogs
10. **Directory Listings** - Developer directories, portfolios.dev

### Outreach Strategy
- Contribute to open-source projects (README mentions)
- Write guest posts for tech blogs
- Participate in developer communities
- Share projects on Product Hunt, Hacker News
- Engage in relevant subreddits (r/webdev, r/augmentedreality)

---

## 11. MOBILE-FIRST BEST PRACTICES

### Mobile Optimization Checklist
- [ ] Responsive design (already using Tailwind)
- [ ] Touch-friendly tap targets (min 48x48px)
- [ ] Readable font sizes (min 16px base)
- [ ] No horizontal scrolling
- [ ] Fast mobile load times (< 3s)
- [ ] Mobile-friendly navigation
- [ ] Avoid intrusive interstitials
- [ ] Test on real devices

### Mobile-Specific Meta Tags
```html
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="theme-color" content="#000000" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

---

## 12. ANALYTICS SETUP

### Google Search Console
1. Verify domain ownership (DNS TXT record or HTML file)
2. Submit sitemap
3. Monitor:
   - Search performance (clicks, impressions, CTR, position)
   - Index coverage
   - Core Web Vitals
   - Mobile usability
   - Security issues

### Google Analytics 4
1. Create GA4 property
2. Install tracking code
3. Set up events:
   - Page views
   - Scroll depth
   - Contact form submissions
   - Resume downloads
   - Project clicks
   - External link clicks

### Key Metrics to Track
| Metric | Target | Why It Matters |
|--------|--------|----------------|
| Organic traffic | +20% monthly | SEO effectiveness |
| Bounce rate | < 50% | Content relevance |
| Avg. session duration | > 2 min | Engagement |
| Pages per session | > 2 | Internal linking |
| Conversion rate | Track | Contact/hire actions |
| Keyword rankings | Top 10 | Visibility |
| Backlinks | +5/month | Authority |

---

## 13. 3-MONTH SEO ACTION PLAN

### Month 1: Foundation
**Week 1-2: Technical Setup**
- [ ] Implement all meta tags (title, description, OG)
- [ ] Create and submit robots.txt
- [ ] Create and submit XML sitemap
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics 4
- [ ] Add structured data (Person, WebSite schemas)
- [ ] Optimize logo for SEO (favicon, OG image)

**Week 3-4: On-Page Optimization**
- [ ] Audit and optimize all page titles
- [ ] Write unique meta descriptions for each page
- [ ] Add alt text to all images
- [ ] Implement internal linking structure
- [ ] Fix any broken links
- [ ] Ensure mobile responsiveness

### Month 2: Content & Performance
**Week 1-2: Content Creation**
- [ ] Write first blog post (technical tutorial)
- [ ] Create detailed project case studies
- [ ] Expand "About" content with keywords
- [ ] Add FAQ section if relevant

**Week 3-4: Performance Optimization**
- [ ] Run Lighthouse audit, fix issues
- [ ] Optimize images (WebP, compression)
- [ ] Implement lazy loading
- [ ] Improve Core Web Vitals scores
- [ ] Test and optimize 3D content loading

### Month 3: Authority Building
**Week 1-2: Backlink Outreach**
- [ ] Update all social profiles with portfolio link
- [ ] Publish article on Dev.to/Medium
- [ ] Contribute to relevant GitHub projects
- [ ] Reach out for guest posting opportunities

**Week 3-4: Analysis & Iteration**
- [ ] Review Search Console data
- [ ] Analyze top-performing keywords
- [ ] Identify content gaps
- [ ] Plan next quarter's content
- [ ] A/B test meta descriptions for CTR

---

## 14. IMPLEMENTATION CHECKLIST

### Immediate Actions (Do Now)
- [x] Analyze current SEO state
- [ ] Add comprehensive metadata to layout.tsx
- [ ] Create robots.txt
- [ ] Create sitemap.xml (or dynamic generation)
- [ ] Add JSON-LD structured data
- [ ] Optimize existing images
- [ ] Add favicon set

### Short-term (This Week)
- [ ] Set up Google Search Console
- [ ] Set up Google Analytics 4
- [ ] Add page-specific metadata to each route
- [ ] Implement canonical URLs
- [ ] Add Open Graph images

### Medium-term (This Month)
- [ ] Create first blog post
- [ ] Build backlinks from profiles
- [ ] Optimize Core Web Vitals
- [ ] Add breadcrumb navigation

### Long-term (Ongoing)
- [ ] Regular content updates
- [ ] Monitor and respond to analytics
- [ ] Build quality backlinks
- [ ] Update for algorithm changes

---

## 15. TOOLS & RESOURCES

### Free SEO Tools
- **Google Search Console** - Index monitoring
- **Google Analytics** - Traffic analysis
- **Google PageSpeed Insights** - Performance
- **Ahrefs Webmaster Tools** - Backlink analysis (free tier)
- **Ubersuggest** - Keyword research (limited free)
- **Answer the Public** - Content ideas
- **Schema Markup Validator** - Test structured data

### Chrome Extensions
- SEO Meta in 1 Click
- Lighthouse
- Web Vitals
- Detailed SEO Extension

---

*Last Updated: February 2024*
*Review and update this strategy quarterly*
