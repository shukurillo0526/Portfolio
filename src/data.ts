import { Project, Skill, ExperienceItem } from './types';

export const personalInfo = {
  name: "Shukurillokh Mamarasulov",
  title: "Agentic Developer & Solo Founder",
  subTitle: "Pioneering the future of full-stack food ecosystems with rapid, AI-driven agentic vibecoding and modular architectures.",
  bio: "I am Shukurillokh, a Computer Science student at Sungkyunkwan University (Class of 2030) and the future solo founder of Plately. I am deeply passionate about agentic software development, leveraging AI and vibecoding to design systems with unmatched velocity. I specialize in full-stack setups, rapid prototyping, and high-performance cross-platform software.",
  email: "shukurillomamarasulovex@gmail.com",
  phone: "+998903850526",
  phoneKR: "+8201025370527",
  github: "https://github.com/shukurillo0526",
  linkedin: "https://www.linkedin.com/in/shukurillokhmamarasulov",
  telegram: "https://t.me/sheikh0526",
  resumeUrl: "#",
};

export const skills: Skill[] = [
  // AI & Workflow
  { name: "Agentic Coding (AI-First)", category: "AI & Workflow", level: 98, iconName: "Sparkles" },
  { name: "Vibe Coding & Prompting", category: "AI & Workflow", level: 95, iconName: "Zap" },
  { name: "Git & GitHub Collaboration", category: "AI & Workflow", level: 90, iconName: "GitMerge" },
  { name: "Fast Prototyping", category: "AI & Workflow", level: 95, iconName: "Clock" },
  
  // Development Stack
  { name: "Flutter & Dart", category: "Development Stack", level: 85, iconName: "Code2" },
  { name: "Python Development", category: "Development Stack", level: 80, iconName: "Terminal" },
  { name: "C Programming Language", category: "Development Stack", level: 78, iconName: "FileCode" },
  { name: "Supabase & Postgres", category: "Development Stack", level: 82, iconName: "Database" },
  
  // Business & Creative
  { name: "SMM & Content Creation", category: "Business & Creative", level: 92, iconName: "PenTool" },
  { name: "Digital Copywriting", category: "Business & Creative", level: 90, iconName: "Play" },
  { name: "Logistics Coordination", category: "Business & Creative", level: 85, iconName: "Box" },
  { name: "Startup Strategy & Marketing", category: "Business & Creative", level: 88, iconName: "Server" },
];

export const projects: Project[] = [
  {
    id: "plately",
    title: "Plately",
    description: "An AI-powered smart kitchen and food ecosystem that turns your phone into a living extension of your fridge, pantry, and cooking habits.",
    longDescription: "Plately (also branded iFridge) is a highly engineered smart-kitchen ecosystem. It connects what people have, what they cook, and what they consume through an intuitive, AI-driven experience designed to eliminate household food waste and track daily health metrics.",
    category: "Full Stack",
    tags: ["Flutter", "Dart", "Supabase", "FastAPI", "AI Agents"],
    image: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/shukurillomamarasulov/plately",
    live: "https://example.com",
    features: [
      "Cook Mode: AI-powered cooking assistant with inventory-aware recipe feeds.",
      "Scan: Vision OCR camera pipeline to parse grocery receipts into structured items.",
      "Living Shelf: Digital visualizer of Fridge, Freezer, and Pantry with dynamic freshness statuses.",
      "Health Layer: Automated calories/macros tracking, meal prep batch planning, and leftovers management.",
      "Order Mode: Business dashboards and checkout systems ready for pilot restaurant integration."
    ]
  },
  {
    id: "markpad",
    title: "Markpad Native",
    description: "A highly optimized text editor available on the Microsoft Store, helping users open, view, and edit all sorts of files like Markdown seamlessly.",
    longDescription: "Markpad Native is a modern file viewing and editing utility optimized for native speed. Built with a responsive interface, it enables smooth file system bindings, beautiful live markdown previews, and offline draft protection.",
    category: "Native Utilities",
    tags: ["Svelte", "SvelteKit", "File System API", "Markpad App"],
    image: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/shukurillomamarasulov/markpad",
    live: "https://apps.microsoft.com",
    features: [
      "Sleek dual-pane Markdown viewer and live syntax compiler.",
      "Microsoft Store certified handler with native system-wide integrations.",
      "Available for editing and viewing all local developer and markdown extensions.",
      "Friction-free backup caching to preserve text drafts and prevent loss."
    ]
  },
  {
    id: "splitride",
    title: "SplitRide",
    description: "A lightweight, interactive ride-sharing platform that helps commuters split taxi fares and optimize travel routes.",
    longDescription: "SplitRide is an optimized travel-pooling utility created to bridge commuters on shared routes. Users can calculate fare breakdowns dynamically, check destination routes, and log split records seamlessly.",
    category: "Web Apps",
    tags: ["JavaScript", "Tailwind CSS", "Maps API", "Dynamic Routing"],
    image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/shukurillomamarasulov/splitride",
    live: "https://example.com",
    features: [
      "Dynamic cost-splitting algorithm based on customized travel segments.",
      "Google Maps API path visualization with commuter pickup nodes.",
      "Minimalist web dashboard designed for fast, high-contrast mobile displays."
    ]
  },
  {
    id: "myflashmind",
    title: "MyFlashMind",
    description: "An intuitive memory retention and flashcard learning system built to accelerate academic and technical recall.",
    longDescription: "MyFlashMind organizes academic courses and technical terms into interactive decks. Running entirely offline-first, it leverages custom memory schedules to enhance recall and track retention rates.",
    category: "Mobile Apps",
    tags: ["Flutter", "Dart", "Hive DB", "Spaced Repetition"],
    image: "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/shukurillomamarasulov/myflashmind",
    live: "https://example.com",
    features: [
      "Highly optimized spaced repetition algorithm for memory retention.",
      "Offline Hive database storage for instant cards loading.",
      "Clean dashboard and state tracking to analyze weekly memory progression."
    ]
  },
  {
    id: "sino",
    title: "SINO App",
    description: "An elegant, interactive utility application built with Flutter to enhance productivity and lifestyle organization.",
    longDescription: "SINO represents a modular framework built to optimize daily routines. Featuring customized timers, task groupings, and interactive visual feedback, it brings high design and rapid state response to mobile.",
    category: "Mobile Apps",
    tags: ["Flutter", "Dart", "Riverpod", "Material Design"],
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=800&q=80",
    github: "https://github.com/shukurillomamarasulov/sino",
    live: "https://example.com",
    features: [
      "Lightweight, cross-platform UI orchestrating highly responsive touch nodes.",
      "State tracking powered by Riverpod to handle asynchronous state events.",
      "Clean visual widgets with dark mode visual elements."
    ]
  }
];

export const experience: ExperienceItem[] = [
  {
    id: "exp1",
    role: "SMM Specialist & Copywriter",
    company: "Turon Education Center",
    duration: "2024 - Present",
    description: "Architected creative marketing strategies, managed digital channels, and built engaging educational content to maximize social media impact.",
    bulletPoints: [
      "Designed and wrote high-engagement social media posts, increasing overall channel interaction.",
      "Engineered a digital outreach framework for online classes and community group enrollment.",
      "Consistently achieved outstanding performance reviews for branding and copywriting precision."
    ],
    tags: ["Marketing", "Copywriting", "SMM", "Content Creation"]
  },
  {
    id: "exp2",
    role: "Logistics Updator & Coordinator",
    company: "Logistics Firm",
    duration: "4 Months (2023)",
    description: "Supervised dynamic status coordination and verified shipment tracking information to sustain error-free transit logs.",
    bulletPoints: [
      "Updated real-time transport logs and database entries with high accuracy and speed.",
      "Collaborated directly with freight operators and terminals to coordinate dispatch.",
      "Optimized tracking communication workflows, lowering entry response delays."
    ],
    tags: ["Logistics", "Operations", "Database Updates", "Coordination"]
  },
  {
    id: "exp3",
    role: "Academic Scholar & Awardee",
    company: "Al-Khwarazmian Specialized School",
    duration: "2023 - 2025",
    description: "Established a track record of academic excellence in exact sciences, linguistics, and analytical achievement.",
    bulletPoints: [
      "Won the prestigious Registan IELTS Grant for outstanding academic and English performance.",
      "Achieved a 7.0 Band Score in IELTS, validating high-level professional-grade English proficiency.",
      "Scored 1180 on the SAT (610 Reading & Writing / 570 Math), showcasing strong mathematical readiness for Computer Science at SKKU."
    ],
    tags: ["Exact Science", "IELTS 7.0", "SAT 1180", "SKKU Computer Science"]
  }
];
