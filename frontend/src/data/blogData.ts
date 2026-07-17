export interface BlogPostData {
  slug: string;
  title: string;
  excerpt: string;
  category: 'engineering' | 'accessibility' | 'product' | 'case_study';
  categoryLabel: string;
  author: {
    name: string;
    role: string;
    avatar: string;
  };
  publishedDate: string;
  readTime: string;
  featured?: boolean;
}

export const BLOG_POSTS: BlogPostData[] = [
  {
    slug: 'spatio-temporal-3d-recognition-pipeline',
    title: 'Breakthrough in 3D Spatio-Temporal Sign Language Recognition Using MediaPipe & PyTorch Bi-LSTMs',
    excerpt: 'An deep architectural exploration of how our circular sliding buffer (T=30) and 126-dimensional normalized spatial vectors achieve sub-45ms real-time ISL classification without specialized depth sensors.',
    category: 'engineering',
    categoryLabel: 'Engineering & AI',
    author: {
      name: 'Dr. Neerja Krishnan',
      role: 'Chief AI Officer & Head of Research',
      avatar: 'NK',
    },
    publishedDate: 'July 14, 2026',
    readTime: '8 min read',
    featured: true,
  },
  {
    slug: 'eliminating-text-flicker-consecutive-debouncing',
    title: 'Eliminating Text Flicker in Real-Time Video Streams: The Mathematics of Consecutive Debouncing',
    excerpt: 'Why raw single-frame neural network classification fails in dynamic video streams, and how our 3-frame threshold debouncing algorithm guarantees clean, natural spoken English output.',
    category: 'engineering',
    categoryLabel: 'Engineering & AI',
    author: {
      name: 'Aravind V.',
      role: 'Principal Computer Vision Architect',
      avatar: 'AV',
    },
    publishedDate: 'July 09, 2026',
    readTime: '6 min read',
  },
  {
    slug: 'wcag-22-aa-high-contrast-focus-rings',
    title: 'Designing for Universal Accessibility: WCAG 2.2 AA Compliance Across Complex AI SaaS Interfaces',
    excerpt: 'How we engineered every touch target to exceed 44x44px, built persistent keyboard focus rings (`focus-ring`), and maintained strict 4.5:1 color contrast across all surface components.',
    category: 'accessibility',
    categoryLabel: 'Accessibility & Ethics',
    author: {
      name: 'Priya Sharma',
      role: 'VP of Product Design & Accessibility',
      avatar: 'PS',
    },
    publishedDate: 'July 02, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'aiims-delhi-emergency-triage-case-study',
    title: 'Case Study: Accelerating Emergency Medical Triage for Deaf Patients at AIIMS Delhi',
    excerpt: 'How deploying on-premise containerized SignBridge AI kiosks reduced patient intake communication delays by 78% while maintaining full HIPAA/FERPA data isolation.',
    category: 'case_study',
    categoryLabel: 'Case Studies & Grants',
    author: {
      name: 'Rajesh K. Verma',
      role: 'VP of Enterprise Solutions',
      avatar: 'RV',
    },
    publishedDate: 'June 24, 2026',
    readTime: '7 min read',
  },
  {
    slug: 'natural-speech-synthesis-indian-english-tts',
    title: 'Bridging the Auditory Gap: Multi-Vendor Neural TTS with Indian English Intonation',
    excerpt: 'Why standard robotic screen readers fall short in real-world conversations, and how we integrated Neerja & Prabhat neural voices with customizable speed multipliers.',
    category: 'product',
    categoryLabel: 'Product Updates',
    author: {
      name: 'Meera N.',
      role: 'Lead Speech & NLP Engineer',
      avatar: 'MN',
    },
    publishedDate: 'June 15, 2026',
    readTime: '5 min read',
  },
  {
    slug: 'open-sourcing-isl-reference-dataset',
    title: 'Announcing Our Open-Access Indian Sign Language 500+ Reference Landmark Dataset',
    excerpt: 'To foster national AI accessibility research, we are open-sourcing over 150,000 normalized spatial hand trajectories under the Creative Commons license.',
    category: 'case_study',
    categoryLabel: 'Case Studies & Grants',
    author: {
      name: 'Dr. Neerja Krishnan',
      role: 'Chief AI Officer & Head of Research',
      avatar: 'NK',
    },
    publishedDate: 'June 04, 2026',
    readTime: '4 min read',
  },
];
