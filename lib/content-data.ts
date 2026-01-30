import { PortfolioMode } from '@/components/providers/mode-provider'

export interface Project {
  id: string
  title: string
  description: string
  longDescription?: string
  technologies: string[]
  category: ('xr' | 'fullstack' | 'research' | 'blockchain')[]
  link?: string
  github?: string
  image?: string
  featured: boolean
  modes: PortfolioMode[]
}

export interface Publication {
  id: string
  title: string
  authors: string[]
  venue: string
  year: number
  link?: string
  abstract?: string
  type: 'journal' | 'conference' | 'thesis' | 'workshop'
}

export interface Skill {
  name: string
  level: number // 0-100
  category: 'language' | 'framework' | 'tool' | 'platform' | 'soft'
  modes: PortfolioMode[]
}

export interface PersonalStory {
  name: string
  origin: string
  bio: string
  hobbies: string[]
  stats: {
    label: string
    value: string
  }[]
}

export const personalStory: PersonalStory = {
  name: "Aasurjya Bikash Handique",
  origin: "Tiloi Nagar, Northeast India",
  bio: "Born in Tiloi Nagar, a small village in Northeast India where the first wifi cable only arrived in 2022. Growing up with weak mobile signals and limited connectivity, I never imagined a path in engineering. My journey is one of curiosity and resilience—from a place where the digital world felt like a distant dream to architecting complex systems and immersive realities.",
  hobbies: ["High-altitude hiking", "Landscape photography", "Solo traveling", "Exploring cultures"],
  stats: [
    { label: "Born in", value: "Tiloi Nagar, Assam" },
    { label: "Passion", value: "Travel & Tech" },
    { label: "Spirit", value: "Adventurer" }
  ]
}

export const projects: Project[] = [
  {
    id: 'edusaas',
    title: 'EduSaaS',
    description: 'Multi-tenant school management system with strict isolation and role-based dashboards.',
    longDescription: 'Architected a multi-tenant SaaS system with strict tenant-level isolation using Row-Level Security. Designed role-based dashboards for admins, teachers, students, and parents. Implemented offline-first synchronization with local caching and conflict resolution.',
    image: '/projects/edusaas.png',
    technologies: ['Next.js', 'PostgreSQL', 'SaaS', 'RLS', 'Multi-tenant'],
    category: ['fullstack'],
    link: 'https://aasurjya.github.io/Flutter-school-management-/',
    github: 'https://github.com/aasurjya',
    modes: ['fullstack'],
    featured: true
  },
  {
    id: 'nexprop',
    title: 'NexProp',
    description: 'Premium real estate platform with interactive 3D building visualization.',
    longDescription: 'Built an interactive 3D building viewer with unit-level inspection and camera controls. Optimized GLTF asset loading for smooth performance on web and mobile. Designed animation-rich interfaces without compromising performance.',
    image: '/projects/nexprop.ai.jpg',
    technologies: ['React', 'Three.js', 'WebGL', 'Next.js', 'GSAP'],
    category: ['fullstack', 'xr'],
    link: 'https://nexprop.vercel.app/',
    modes: ['fullstack', 'xr'],
    featured: true
  },
  {
    id: 'ghorbhara',
    title: 'Ghor Bhara',
    description: 'Assamese rental marketplace supporting multiple roles and secure payments.',
    longDescription: 'Built a multi-role rental marketplace supporting tenants, landlords, and admins. Implemented secure payment flows and document uploads. Designed role-based dashboards and analytics views.',
    image: '/projects/Bharaghor.png',
    technologies: ['Next.js', 'Tailwind', 'Stripe', 'MongoDB'],
    category: ['fullstack'],
    link: 'https://tiloirent.vercel.app/',
    modes: ['fullstack'],
    featured: false
  },
  {
    id: 'pokharas',
    title: 'pokharas.com',
    description: 'Travel and hospitality marketplace platform for Nepal with curated listings.',
    longDescription: 'Built a content-rich travel marketplace with curated listings and discovery flows. Implemented category-based search and filtering for local services. Delivered a cohesive visual identity optimized for international audiences.',
    image: '/projects/pokharas.com.png',
    technologies: ['Next.js', 'SEO', 'Marketplace', 'Tailwind'],
    category: ['fullstack'],
    link: 'https://pokharas.com',
    modes: ['fullstack'],
    featured: false
  },
  {
    id: 'nexvr',
    title: 'NexVR - Immersive VR/AR Real Estate Platform',
    description: 'A highly animated, immersive VR/AR real estate platform built with Next.js, Three.js, TypeScript, and Framer Motion.',
    longDescription: 'Highly animated VR/AR real estate platform featuring 3D particle backgrounds with GPGPU computation, magnetic cursor effects, interactive building configurator, case studies carousel, metrics dashboard with neon glow effects, 3D testimonials carousel, and smooth scroll powered by Lenis. Includes GSAP ScrollTrigger animations, Framer Motion transitions, Three.js real-time interactivity, and glass morphism design.',
    image: '/projects/nexvr.png',
    technologies: ['Next.js', 'Three.js', 'TypeScript', 'Framer Motion', 'GSAP', 'Tailwind CSS', '@react-three/fiber', '@react-three/drei', 'Lenis', 'Zustand'],
    category: ['xr', 'fullstack'],
    link: 'https://nexvr.vercel.app/',
    modes: ['xr', 'fullstack'],
    featured: true
  },
  {
    id: 'face-recog',
    title: 'Real-Time Face Recognition',
    description: 'Computer vision system using Python and OpenCV for live identity matching.',
    longDescription: 'Built a real-time face recognition system using Python and OpenCV with live webcam input. Implemented face detection and 128-dimensional face embeddings for identity recognition. Designed a matching pipeline that compares live face encodings against stored encodings using similarity counts.',
    image: '/projects/facerecog.jpg',
    technologies: ['Python', 'OpenCV', 'AI', 'Computer Vision'],
    category: ['research', 'fullstack'],
    github: 'https://github.com/aasurjya/Face-Recognization',
    modes: ['phd', 'fullstack'],
    featured: false
  },
  {
    id: 'world-ranger',
    title: 'World Ranger Forum',
    description: 'Sole UI Designer for the primary digital platform of the 1st Asian Ranger Forum.',
    longDescription: 'Designed an intuitive and visually engaging interface using dynamic color schemes and mood features to enhance user immersion, aligning the visual identity with the forum’s theme of "Asia’s Biodiversity Guardians."',
    image: '/projects/worldranger.jpg',
    technologies: ['UI/UX', 'Figma', 'Product Design'],
    category: ['research', 'xr'],
    link: 'https://www.asianrangerforum.org/',
    modes: ['phd', 'xr'],
    featured: true
  },
  {
    id: 'hci-research',
    title: 'VR Comfort Study Platform',
    description: 'Research platform for studying VR comfort and usability',
    longDescription: 'Comprehensive research platform for conducting controlled studies on VR comfort, motion sickness, and user experience.',
    technologies: ['Unity', 'Python', 'R', 'TensorFlow'],
    category: ['research', 'xr'],
    featured: true,
    modes: ['phd'],
    link: 'https://research.example.com',
    image: '/images/research.jpg'
  },
  {
    id: 'algosender',
    title: 'AlgoSender',
    description: 'Algorand TestNet transaction platform with real-time analytics and beautiful UI',
    longDescription: 'Send, track, and manage Algorand assets with unmatched speed and beauty. Built on a foundation of liquid glass aesthetics. Features secure TestNet transactions, real-time monitoring, transaction analytics, and live ecosystem stats including total transactions, success rates, and network integrity.',
    technologies: ['Next.js', 'React', 'Algorand SDK', 'Tailwind CSS', 'TypeScript', 'Web3'],
    category: ['blockchain', 'fullstack'],
    featured: true,
    modes: ['fullstack'],
    link: 'https://algo-sender.vercel.app/',
    github: 'https://github.com/aasurjya/AlgoSender_Blockchain',
    image: '/projects/algosender.png'
  }
]

export const publications: Publication[] = [
  {
    id: 'pub1',
    title: 'Human-Centered Design Principles for Extended Reality Interfaces',
    authors: ['Aasurjya B.', 'Smith J.', 'Johnson K.'],
    venue: 'CHI Conference on Human Factors in Computing Systems',
    year: 2024,
    type: 'conference',
    link: 'https://doi.org/example',
    abstract: 'This paper presents a comprehensive framework for designing XR interfaces that prioritize user comfort and engagement...'
  },
  {
    id: 'pub2',
    title: 'Reducing Motion Sickness in Virtual Reality: A Comparative Study',
    authors: ['Aasurjya B.', 'Chen L.'],
    venue: 'IEEE Transactions on Visualization and Computer Graphics',
    year: 2023,
    type: 'journal',
    link: 'https://doi.org/example'
  },
  {
    id: 'pub3',
    title: 'Adaptive Rendering Techniques for Mobile AR Applications',
    authors: ['Aasurjya B.'],
    venue: 'SIGGRAPH Asia',
    year: 2023,
    type: 'conference'
  }
]

export const skills: Skill[] = [
  // Programming Languages
  { name: 'JavaScript/TypeScript', level: 95, category: 'language', modes: ['fullstack', 'xr'] },
  { name: 'Python', level: 90, category: 'language', modes: ['phd', 'fullstack'] },
  { name: 'C#', level: 85, category: 'language', modes: ['xr'] },
  { name: 'C++', level: 75, category: 'language', modes: ['xr'] },
  { name: 'Solidity', level: 70, category: 'language', modes: ['fullstack'] },
  
  // Frameworks
  { name: 'React/Next.js', level: 95, category: 'framework', modes: ['fullstack'] },
  { name: 'Three.js', level: 90, category: 'framework', modes: ['xr', 'fullstack'] },
  { name: 'Unity', level: 85, category: 'framework', modes: ['xr'] },
  { name: 'Node.js', level: 90, category: 'framework', modes: ['fullstack'] },
  { name: 'WebXR', level: 80, category: 'framework', modes: ['xr'] },
  
  // Tools & Platforms
  { name: 'AWS/GCP', level: 85, category: 'platform', modes: ['fullstack'] },
  { name: 'Docker/K8s', level: 80, category: 'tool', modes: ['fullstack'] },
  { name: 'MongoDB/PostgreSQL', level: 85, category: 'tool', modes: ['fullstack'] },
  { name: 'Blender', level: 70, category: 'tool', modes: ['xr'] },
  { name: 'Git/CI/CD', level: 90, category: 'tool', modes: ['fullstack', 'xr'] },
  
  // Research & Soft Skills
  { name: 'Research Methods', level: 90, category: 'soft', modes: ['phd'] },
  { name: 'Data Analysis', level: 85, category: 'soft', modes: ['phd'] },
  { name: 'Technical Writing', level: 88, category: 'soft', modes: ['phd'] },
  { name: 'Project Management', level: 85, category: 'soft', modes: ['fullstack'] },
  { name: 'UI/UX Design', level: 80, category: 'soft', modes: ['xr', 'fullstack'] }
]

export interface ResumeItem {
  id: string
  title: string
  organization: string
  location: string
  duration: string
  highlights: string[]
}

export interface ResumeData {
  education: ResumeItem[]
  experience: ResumeItem[]
}

export const resumeContent: Record<PortfolioMode, ResumeData> = {
  phd: {
    education: [
      {
        id: 'mtech-iitj',
        title: 'M.Tech in Augmented Reality and Virtual Reality',
        organization: 'Indian Institute of Technology (IIT), Jodhpur',
        location: 'Jodhpur, India',
        duration: '2022 - 2025',
        highlights: [
          'Researching neuro-adaptive XR interfaces for cognitive load reduction.',
          'Specializing in multi-tenant architectures and immersive 3D systems.',
          'Developing frameworks for spatial awareness in Mixed Reality.'
        ]
      },
      {
        id: 'btech-tezpur',
        title: 'B.Tech in Computer Science and Engineering',
        organization: 'Tezpur University',
        location: 'Tezpur, India',
        duration: '2018 - 2022',
        highlights: [
          'Graduated with First Division.',
          'Focused on Software Engineering and Computer Graphics.',
          'Built foundational skills in scalable system design.'
        ]
      }
    ],
    experience: [
      {
        id: 'ihub-tech',
        title: 'Tech Engineer & Research Associate',
        organization: 'iHub Drishti (IIT Jodhpur)',
        location: 'Jodhpur, India',
        duration: 'Sep 2023 - Present',
        highlights: [
          'Designed and developed scalable Flutter applications with modular architecture.',
          'Built automation for e57 point cloud files to Gaussian splats analysis.',
          'Architected multi-tenant and role-based systems emphasizing security.',
          'Developed AR/VR systems using Unity, ARKit, and ARCore.',
          'Managed AWS-based deployments and asset delivery workflows.'
        ]
      },
      {
        id: 'heptre-fs',
        title: 'Full Stack Developer',
        organization: 'Heptre',
        location: 'Remote',
        duration: 'Jul 2022 - Sep 2023',
        highlights: [
          'Built production web applications using React and Next.js.',
          'Managed AWS infrastructure (EC2, S3, SQS, Lambda).',
          'Containerized and deployed systems using Docker and Kubernetes.',
          'Managed infrastructure using Terraform.'
        ]
      },
      {
        id: 'iqvia-intern',
        title: 'Software Engineer Intern',
        organization: 'IQVIA',
        location: 'Remote',
        duration: 'Aug 2022 - Dec 2022',
        highlights: [
          'Integrated APIs with MongoDB-backed services.',
          'Implemented 1000+ unit tests for backend stability.'
        ]
      },
      {
        id: 'cognizant-trainee',
        title: 'Programmer Analyst Trainee',
        organization: 'Cognizant',
        location: 'Remote',
        duration: 'Feb 2022 - Aug 2022',
        highlights: [
          'Developed SQL pipelines and analytical dashboards.'
        ]
      }
    ]
  },
  xr: {
    education: [
      {
        id: 'mtech-xr',
        title: 'M.Tech in AR & VR',
        organization: 'IIT Jodhpur',
        location: 'Jodhpur, India',
        duration: '2022 - 2025',
        highlights: [
          'Specialized in Augmented Reality and Virtual Reality technologies.',
          'Hands-on experience with Unity, ARKit, ARCore, and WebXR.',
          'Focus on performance optimization for immersive 3D systems.'
        ]
      },
      {
        id: 'btech-xr',
        title: 'B.Tech in CSE',
        organization: 'Tezpur University',
        location: 'India',
        duration: '2018 - 2022',
        highlights: [
          'First Division Graduate.',
          'Strong foundation in Computer Graphics and 3D modeling principles.'
        ]
      }
    ],
    experience: [
      {
        id: 'ihub-xr',
        title: 'Tech Engineer (XR Specialist)',
        organization: 'iHub Drishti',
        location: 'Jodhpur, India',
        duration: 'Sep 2023 - Present',
        highlights: [
          'Developed AR/VR systems using Unity, ARKit, and ARCore.',
          'Built automation pipelines for converting point clouds to Gaussian splats.',
          'Optimized 3D rendering performance for mobile and web platforms.',
          'Managed workshops on AR/VR technology for DST.'
        ]
      },
      {
        id: 'heptre-xr',
        title: 'Full Stack Developer',
        organization: 'Heptre',
        location: 'Remote',
        duration: 'Jul 2022 - Sep 2023',
        highlights: [
          'Integrated 3D visualizations into full-stack web applications.',
          'Managed cloud infrastructure for hosting heavy 3D assets.',
          'Containerized XR-ready web services using Docker.'
        ]
      }
    ]
  },
  fullstack: {
    education: [
      {
        id: 'mtech-fs',
        title: 'M.Tech in AR & VR',
        organization: 'IIT Jodhpur',
        location: 'Jodhpur, India',
        duration: '2022 - 2025',
        highlights: [
          'Architected scalable systems for heavy compute loads (XR/AI).',
          'Designed multi-tenant architectures and role-based access control systems.'
        ]
      },
      {
        id: 'btech-fs',
        title: 'B.Tech in Computer Science',
        organization: 'Tezpur University',
        location: 'India',
        duration: '2018 - 2022',
        highlights: [
          'First Division in Computer Science and Engineering.',
          'Solid groundwork in Algorithms, Data Structures, and Database Management.'
        ]
      }
    ],
    experience: [
      {
        id: 'ihub-fs',
        title: 'Tech Engineer',
        organization: 'iHub Drishti',
        location: 'Jodhpur, India',
        duration: 'Sep 2023 - Present',
        highlights: [
          'Designed scalable Flutter apps with modular architecture.',
          'Architected multi-tenant SaaS systems with strict security isolation.',
          'Implemented automated pipelines for complex data processing (e57 to Splats).',
          'Worked with AWS-based deployments and asset delivery.'
        ]
      },
      {
        id: 'heptre-fs-lead',
        title: 'Full Stack Developer',
        organization: 'Heptre',
        location: 'Remote',
        duration: 'Jul 2022 - Sep 2023',
        highlights: [
          'Built production web apps with React and Next.js.',
          'Managed AWS infrastructure (EC2, S3, SQS, Lambda) and Terraform.',
          'Deployed systems using Docker and Kubernetes.'
        ]
      },
      {
        id: 'iqvia-fs',
        title: 'Software Engineer Intern',
        organization: 'IQVIA',
        location: 'Remote',
        duration: 'Aug 2022 - Dec 2022',
        highlights: [
          'Integrated APIs with MongoDB-backed services.',
          'Wrote 1000+ unit tests ensuring backend stability.'
        ]
      },
      {
        id: 'cognizant-fs',
        title: 'Programmer Analyst Trainee',
        organization: 'Cognizant',
        location: 'Remote',
        duration: 'Feb 2022 - Aug 2022',
        highlights: [
          'Developed SQL pipelines and analytical dashboards.'
        ]
      }
    ]
  }
}

export const aboutContent = {
  phd: {
    title: 'PhD Researcher in Human-Computer Interaction',
    bio: `Exploring the boundaries of spatial computing through the lens of human cognition. My research focuses on developing neuro-adaptive XR interfaces that prioritize user comfort and minimize cognitive load in complex virtual environments.`,
    highlights: [
      'Published 5+ papers in top-tier HCI conferences (CHI, ISMAR)',
      'Developing framework for adaptive VR motion sickness mitigation',
      'Collaborating with neuroscientists on spatial awareness in MR'
    ]
  },
  xr: {
    title: 'XR Developer & Creative Technologist',
    bio: `Merging 3D graphics with immersive storytelling to build the next generation of spatial experiences. I specialize in high-performance WebXR and Unity development, pushing the limits of what's possible in mobile and desktop AR/VR.`,
    highlights: [
      'Lead Developer for chARitram - award-winning cultural AR',
      'Expert in Three.js, WebXR, and real-time shader development',
      'Building performant 3D assets and immersive interactive systems'
    ]
  },
  fullstack: {
    title: 'Full Stack Engineer & Solution Architect',
    bio: `Architecting robust, scalable SaaS ecosystems with a focus on high-concurrency and modern cloud infrastructure. I bridge the gap between complex backend logic and pixel-perfect, interactive frontend experiences.`,
    highlights: [
      'Designed enterprise-scale multi-tenant SaaS platforms',
      'Specialist in Next.js, Distributed Systems, and DevOps',
      'Implemented secure blockchain infrastructure for DeFi wallets'
    ]
  }
}
