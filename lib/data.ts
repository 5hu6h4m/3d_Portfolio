export interface Project {
  title: string;
  role: string;
  symbolicTeammate: string;
  symbolism: string;
  description: string;
  rank: string;
  tags: string[];
}

export interface Skill {
  name: string;
  category: string;
  chakraNature: string;
  glowColor: string;
  level: number;
}

export interface Mission {
  title: string;
  category: string;
  rank: string;
  description: string;
  date: string;
}

export interface Threat {
  name: string;
  description: string;
  impact: string;
  symbolicEnemy: string;
  resolution: string;
}

export const CHAPTERS = [
  { id: 1, title: "The Unknown Shinobi", subtitle: "Birth of a Maker" },
  { id: 2, title: "Academy Entrance", subtitle: "MET E-Cell & Robotics Foundation" },
  { id: 3, title: "Elemental Training Ground", subtitle: "Mastering the Tech Chakra" },
  { id: 4, title: "The Ninja Squad", subtitle: "S-Rank Teammates (Projects)" },
  { id: 5, title: "The Rogue Threats", subtitle: "Bugs, Failures, and Deadlines" },
  { id: 6, title: "Sage Awakening", subtitle: "The Ultimate Drone Project" },
  { id: 7, title: "Chunin Examination Arena", subtitle: "Missions Completed & Badges" },
  { id: 8, title: "The Hokage Monument", subtitle: "Shinobi Legacy & Future Vision" }
];

export const PROJECTS: Project[] = [
  {
    title: "RossInc AI Social Media Director",
    role: "Founder & Lead Shinobi",
    symbolicTeammate: "Naruto",
    symbolism: "Unwavering Hope & Community Growth",
    description: "Built automated pipeline agents to schedule, edit, and post short-form cinematic video reels. Scaling creator operations autonomously.",
    rank: "A-Rank",
    tags: ["Python", "OpenAI", "FFmpeg", "Next.js", "Redis"]
  },
  {
    title: "Autonomous Drone Mapping Spline",
    role: "Robotics Architect",
    symbolicTeammate: "Sasuke",
    symbolism: "Chidori-fast Precision & Strongest Ambition",
    description: "Developed real-time SLAM navigation algorithms for autonomous multirotors, processing spatial data on edge hardware in obstacle courses.",
    rank: "S-Rank",
    tags: ["ROS", "C++", "Python", "SLAM", "OpenCV"]
  },
  {
    title: "Chakra-level Edge Vision AI",
    role: "Computer Vision Specialist",
    symbolicTeammate: "Kakashi",
    symbolism: "Sharingae-like Focus & Professionalism",
    description: "Constructed deep-learning object detector models optimized to run on tiny Raspberry Pi microcontrollers at 30 FPS.",
    rank: "A-Rank",
    tags: ["PyTorch", "TensorRT", "YOLOv8", "Raspberry Pi"]
  },
  {
    title: "Web-based Interactive Robot Sim",
    role: "Frontend Engineer",
    symbolicTeammate: "Sakura",
    symbolism: "Clean Chakra Control & UI Refinement",
    description: "Created high-fidelity 3D robot arm simulators using WebGL, allowing real-time trajectory visualization inside web browsers.",
    rank: "B-Rank",
    tags: ["Three.js", "React Three Fiber", "GSAP", "TypeScript"]
  }
];

export const SKILLS: Skill[] = [
  { name: "ROS / C++", category: "Robotics", chakraNature: "Lightning (Raiton)", glowColor: "#3b82f6", level: 90 },
  { name: "Python / PyTorch", category: "AI", chakraNature: "Fire (Katon)", glowColor: "#ef4444", level: 95 },
  { name: "Computer Vision", category: "AI", chakraNature: "Wind (Futon)", glowColor: "#10b981", level: 88 },
  { name: "Next.js / React", category: "Web Development", chakraNature: "Water (Suiton)", glowColor: "#60a5fa", level: 85 },
  { name: "Three.js / GLSL Shaders", category: "Creative Coding", chakraNature: "Yin-Yang (Inyo)", glowColor: "#a855f7", level: 90 },
  { name: "Embedded Linux", category: "Robotics", chakraNature: "Earth (Doton)", glowColor: "#f59e0b", level: 82 }
];

export const MISSIONS: Mission[] = [
  {
    title: "National Robotics Championship Top Rank",
    category: "Competition",
    rank: "S-Rank Medal",
    description: "Designed, manufactured, and programmed a battle-ready heavyweight bot, securing top ranks among national collegiate competitors.",
    date: "2025"
  },
  {
    title: "Vice President at MET E-Cell",
    category: "Leadership",
    rank: "A-Rank Scroll",
    description: "Led operations, entrepreneurial hackathons, and incubator sessions for student builders, fostering corporate partnerships.",
    date: "2025-2026"
  },
  {
    title: "Founder, RossInc Media House",
    category: "Entrepreneurship",
    rank: "A-Rank Title",
    description: "Established a creative production house automating high-end commercial videography, animation, and creator tooling.",
    date: "2024"
  }
];

export const THREATS: Threat[] = [
  {
    name: "Segmentation Faults & C++ Memory Leaks",
    description: "Rogue pointers trying to corrupt drone flight telemetry data.",
    impact: "Uncontrolled crashes during obstacle courses.",
    symbolicEnemy: "Pain",
    resolution: "Implemented smart pointers and strict valgrind memory leak scans to restore telemetry balance."
  },
  {
    name: "Strict Client Deadlines",
    description: "Sudden project specifications requested in the middle of Chunin Exams.",
    impact: "Sleep deprivation and coordinate mismatch.",
    symbolicEnemy: "Obito",
    resolution: "Automated media rendering pipelines so projects build and compile while resting."
  },
  {
    name: "CUDA Out of Memory Errors",
    description: "Attempting to train larger vision transformer models on limited VRAM.",
    impact: "Hanging batch compilation sessions.",
    symbolicEnemy: "Itachi",
    resolution: "Optimized model quantization and mixed-precision training parameter checks."
  }
];
