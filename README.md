# Aasurjya Portfolio - High-Class Interactive Portfolio

A cutting-edge portfolio website featuring dynamic theming, 3D animations, and real-time visitor analytics. Built with Next.js 14, TypeScript, Three.js, and MongoDB.

## 🌟 Features

### Dynamic Mode Selection
- **PhD Research Mode**: Academic-focused content with publications and research highlights
- **XR Developer Mode**: Showcases AR/VR projects with futuristic theming
- **Full Stack Mode**: Enterprise and SaaS project focus with professional styling

### Interactive 3D Avatar
- Fully interactive Three.js avatar in hero section
- Mouse tracking and click animations
- Dynamic colors based on selected mode
- Optimized performance with lazy loading

### Advanced Analytics Dashboard
- Real-time visitor tracking with geolocation
- Interactive charts and world map visualization
- Mode selection analytics
- Secure admin authentication

### Premium Animations
- GSAP-powered scroll animations
- Parallax effects and smooth transitions
- Micro-interactions for enhanced UX
- Responsive and performant

### Content Sections
- **Hero**: 3D avatar with mode selection
- **About**: Dynamic bio based on selected mode
- **Projects**: Filtered by mode with featured highlights
- **Publications**: Academic papers (PhD mode only)
- **Skills**: Categorized skill visualization
- **Contact**: Interactive contact form with social links

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB Atlas account (for analytics)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/aasurjya-portfolio.git
cd aasurjya-portfolio
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with:
```env
MONGODB_URI=your_mongodb_connection_string
NEXT_PUBLIC_APP_URL=http://localhost:3000
JWT_SECRET=your_jwt_secret_key
ADMIN_PASSWORD_HASH=your_bcrypt_hashed_password
```

4. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the portfolio.

## 🔐 Admin Dashboard

Access the analytics dashboard at `/admin`

Default credentials for demo:
- Password: `admin123`

The dashboard provides:
- Total visitor count
- Geographic distribution map
- Mode selection analytics
- Time-series visitor data
- Top countries and cities
- Real-time visitor feed

## 🛠️ Tech Stack

### Frontend
- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **Three.js/React Three Fiber**: 3D graphics
- **GSAP**: Premium animations
- **Framer Motion**: Micro-interactions

### Backend
- **Next.js API Routes**: Server endpoints
- **MongoDB Atlas**: Database for analytics
- **JWT**: Authentication
- **Geoip-lite**: IP geolocation

### Analytics & Visualization
- **Chart.js**: Interactive charts
- **React Simple Maps**: World map visualization
- **Custom tracking**: Visitor analytics

## 📱 Responsive Design

The portfolio is fully responsive with:
- Mobile-first approach
- Touch gestures for 3D interactions
- Optimized layouts for all screen sizes
- Progressive enhancement

## 🎨 Theming System

Three distinct visual themes:
- **PhD Mode**: Academic blues, serif typography
- **XR Mode**: Neon accents, futuristic feel
- **Full Stack Mode**: Professional greens/blues

Themes affect:
- Color schemes
- Typography
- Content emphasis
- Project filtering
- Skill highlighting

## 🔄 Project Structure

```
aasurjya-portfolio/
├── app/
│   ├── api/           # API routes
│   ├── admin/         # Admin dashboard
│   ├── layout.tsx     # Root layout
│   └── page.tsx       # Home page
├── components/
│   ├── 3d/           # Three.js components
│   ├── sections/     # Page sections
│   ├── providers/    # Context providers
│   └── ui/           # UI components
├── lib/              # Utilities and data
├── hooks/            # Custom React hooks
└── public/           # Static assets
```

## 📊 Performance Optimizations

- Lazy loading for 3D models
- Image optimization with Next.js
- Code splitting and dynamic imports
- Efficient re-renders with React.memo
- Optimized bundle size
- Server-side rendering for SEO

## 🚢 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Self-hosting
1. Build the project:
```bash
npm run build
```

2. Start production server:
```bash
npm start
```

## 📈 Analytics Setup

1. Create a MongoDB Atlas cluster
2. Get connection string
3. Add to `.env.local`
4. Whitelist deployment IP addresses
5. Analytics will auto-track visitors

## 🔧 Customization

### Adding Projects
Edit `lib/content-data.ts`:
```typescript
export const projects: Project[] = [
  {
    id: 'new-project',
    title: 'Your Project',
    description: 'Description',
    technologies: ['Tech1', 'Tech2'],
    category: ['fullstack'],
    modes: ['fullstack'],
    featured: true
  }
]
```

### Modifying Skills
Update the skills array in `lib/content-data.ts`

### Changing Theme Colors
Edit CSS variables in `app/globals.css`

## 📝 License

MIT License - feel free to use for your own portfolio!

## 🤝 Contributing

Contributions welcome! Please feel free to submit a Pull Request.

## 📧 Contact

For questions or support, reach out at hello@aasurjya.com

---

Built with ❤️ using cutting-edge web technologies
