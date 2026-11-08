import { GNRCCourse } from '../types';

export const GNRC_COURSES: GNRCCourse[] = [
  // A. COMPUTER FUNDAMENTALS
  {
    id: 'gnrc-comp-basics',
    title: 'Computer Basics & Hardware Foundations',
    category: 'Computer Fundamentals',
    duration: '3 Months',
    feePKR: 15000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Master essential computer operations, hardware components, CPU, RAM, storage, peripherals, and foundational digital literacy.',
    learningObjectives: ['Understand CPU, RAM & Storage', 'Operate desktop computers confidently', 'Master peripheral connections'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Introduction to Computer Systems & Hardware', topics: ['Input/Output Devices', 'Motherboard & Processor', 'Storage Drives'] },
      { week: 'Week 5-8', title: 'Operating Systems & Peripherals', topics: ['System Architecture', 'Device Drivers', 'Basic Peripherals'] }
    ],
    instructorName: 'Engr. Muhammad Hamza (Senior Hardware Instructor)'
  },
  {
    id: 'gnrc-comp-hw-sw',
    title: 'Computer Hardware & Software Installation',
    category: 'Computer Fundamentals',
    duration: '3 Months',
    feePKR: 18000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Learn system assembly, operating system installation, driver configuration, and utility software setup.',
    learningObjectives: ['Assemble PC components', 'Install Windows OS', 'Configure system drivers'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Hardware Assembly', topics: ['Component Mounting', 'Power Supply Setup', 'BIOS Configuration'] },
      { week: 'Week 5-8', title: 'Software Installation', topics: ['OS Installation', 'Driver Setup', 'Essential Utilities'] }
    ],
    instructorName: 'Engr. Muhammad Hamza'
  },
  {
    id: 'gnrc-win-os',
    title: 'Windows Operating System Mastery',
    category: 'Computer Fundamentals',
    duration: '3 Months',
    feePKR: 15000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Comprehensive navigation, control panel settings, user management, and security configurations in Windows 11.',
    learningObjectives: ['Master Windows 11 interface', 'Manage user accounts', 'Configure security settings'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Windows Navigation', topics: ['Desktop Customization', 'Control Panel', 'Settings App'] },
      { week: 'Week 5-8', title: 'System Management', topics: ['Task Manager', 'Disk Management', 'User Access Control'] }
    ],
    instructorName: 'Prof. Usama Raza'
  },
  {
    id: 'gnrc-file-mgmt',
    title: 'File Management & Data Organization',
    category: 'Computer Fundamentals',
    duration: '3 Months',
    feePKR: 15000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Master file directory structures, cloud storage synchronization, backup strategies, and file compression.',
    learningObjectives: ['Organize file directories', 'Use cloud backup services', 'Master zip and compression'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Directory Architecture', topics: ['Folder Tree Structure', 'File Permissions', 'Naming Conventions'] }
    ],
    instructorName: 'Prof. Usama Raza'
  },
  {
    id: 'gnrc-troubleshoot',
    title: 'Computer Troubleshooting & Maintenance',
    category: 'Computer Fundamentals',
    duration: '3 Months',
    feePKR: 18000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Diagnose common hardware faults, software crashes, malware removal, and preventive maintenance.',
    learningObjectives: ['Diagnose boot errors', 'Remove viruses and malware', 'Perform disk cleanup'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Diagnostic Utilities', topics: ['Event Viewer', 'Safe Mode Boot', 'Antivirus Scans'] }
    ],
    instructorName: 'Engr. Muhammad Hamza'
  },
  {
    id: 'gnrc-internet-email',
    title: 'Internet & Professional Email Communication',
    category: 'Computer Fundamentals',
    duration: '3 Months',
    feePKR: 15000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Professional web browsing, search engine techniques, Gmail, Outlook, and online safety practices.',
    learningObjectives: ['Perform advanced web searches', 'Write professional emails', 'Practice online safety'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Web Navigation & Safety', topics: ['Browser Security', 'Email Composition', 'Phishing Awareness'] }
    ],
    instructorName: 'Prof. Usama Raza'
  },
  {
    id: 'gnrc-prod-skills',
    title: 'Computer Productivity & Digital Workflow',
    category: 'Computer Fundamentals',
    duration: '3 Months',
    feePKR: 16000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Shortcuts, multi-tasking techniques, digital note-taking, and cloud collaboration tools.',
    learningObjectives: ['Master Windows keyboard shortcuts', 'Use digital note apps', 'Manage digital tasks'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Workflow Optimization', topics: ['Keyboard Shortcuts', 'Task Scheduling', 'Cloud Drive Sync'] }
    ],
    instructorName: 'Prof. Usama Raza'
  },

  // B. OFFICE PRODUCTIVITY
  {
    id: 'gnrc-ms-word',
    title: 'Microsoft Word Professional Formatting',
    category: 'Office Productivity',
    duration: '3 Months',
    feePKR: 16000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Create professional reports, letters, tables, headers, footers, mail merges, and official document designs.',
    learningObjectives: ['Format complex documents', 'Design tables and graphics', 'Master Mail Merge'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Document Formatting', topics: ['Typography & Paragraphs', 'Header & Footers', 'Table Design'] }
    ],
    instructorName: 'Sir Rashid Ahmed (Senior Office Master Instructor)'
  },
  {
    id: 'gnrc-ms-excel',
    title: 'Microsoft Excel Data Analysis & Formulas',
    category: 'Office Productivity',
    duration: '3 Months',
    feePKR: 22000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Spreadsheet mastery, VLOOKUP, XLOOKUP, Pivot Tables, conditional formatting, and chart visualizations.',
    learningObjectives: ['Write VLOOKUP & XLOOKUP formulas', 'Build Pivot Tables', 'Create charts and dashboards'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Formulas & Functions', topics: ['SUMIF, COUNTIF, VLOOKUP', 'Logical IF Statements', 'Conditional Formatting'] },
      { week: 'Week 5-8', title: 'Pivot Tables & Charts', topics: ['Data Aggregation', 'Pivot Charts', 'Dashboard Design'] }
    ],
    instructorName: 'Sir Rashid Ahmed'
  },
  {
    id: 'gnrc-ms-powerpoint',
    title: 'Microsoft PowerPoint Presentation Design',
    category: 'Office Productivity',
    duration: '3 Months',
    feePKR: 16000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Design impactful pitch decks, slides, animations, transitions, and multimedia presentations.',
    learningObjectives: ['Design professional slide layouts', 'Apply custom transitions', 'Embed video and audio'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Slide Master & Design', topics: ['Layout Principles', 'Animations & Morph', 'Pitch Deck Structure'] }
    ],
    instructorName: 'Sir Rashid Ahmed'
  },
  {
    id: 'gnrc-ms-office-complete',
    title: 'Microsoft Office Complete Specialist Suite',
    category: 'Office Productivity',
    duration: '6 Months',
    feePKR: 32000,
    registrationFeePKR: 2000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Masterclass',
    description: 'Complete 6-month diploma covering Word, Excel, PowerPoint, Access, and Outlook with practical office scenarios.',
    learningObjectives: ['Master Word, Excel & PowerPoint', 'Design Access databases', 'Manage Outlook email and calendar'],
    curriculumModules: [
      { week: 'Month 1-2', title: 'MS Word & Document Design', topics: ['Advanced Documents', 'Templates', 'Mail Merge'] },
      { week: 'Month 3-4', title: 'MS Excel Data Mastery', topics: ['Advanced Formulas', 'Pivot Tables', 'Macros'] },
      { week: 'Month 5-6', title: 'PowerPoint & Outlook Office Workflow', topics: ['Pitch Decks', 'Outlook Management', 'MS Access'] }
    ],
    instructorName: 'Sir Rashid Ahmed'
  },

  // C. TYPING & COMMUNICATION
  {
    id: 'gnrc-eng-typing',
    title: 'English Touch Typing Mastery',
    category: 'Typing & Communication',
    duration: '3 Months',
    feePKR: 12000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Master touch typing without looking at keyboard to achieve 40–60 WPM with high accuracy.',
    learningObjectives: ['Master home row posture', 'Achieve 45+ WPM typing speed', 'Maintain 98% accuracy'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Home Row & Key Placement', topics: ['Finger Posture', 'Key Drills', 'Accuracy Practice'] }
    ],
    instructorName: 'Madam Sana Tariq'
  },
  {
    id: 'gnrc-urdu-typing',
    title: 'Urdu InPage & Phonetic Typing',
    category: 'Typing & Communication',
    duration: '3 Months',
    feePKR: 12000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Learn InPage Urdu typesetting, Pak Phonetic Keyboard, and official document composing in Urdu.',
    learningObjectives: ['Type fluently in Urdu InPage', 'Master Pak Phonetic layout', 'Compose official Urdu letters'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Urdu Composing & InPage', topics: ['InPage Layout', 'Phonetic Keyboard', 'Urdu Document Formatting'] }
    ],
    instructorName: 'Madam Sana Tariq'
  },

  // D. WEB DEVELOPMENT
  {
    id: 'gnrc-html-css',
    title: 'HTML5 & CSS3 Web Design Essentials',
    category: 'Web Development',
    duration: '3 Months',
    feePKR: 20000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Learn semantically structured HTML5 web pages and beautiful CSS3 layouts with Flexbox and Grid.',
    learningObjectives: ['Build semantic web pages', 'Master CSS Flexbox and Grid', 'Style mobile-friendly sites'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'HTML Structure & CSS Fundamentals', topics: ['HTML5 Tags', 'CSS Selectors', 'Flexbox Layout'] }
    ],
    instructorName: 'Engr. Shahzaib Khan (Lead Web Engineer)'
  },
  {
    id: 'gnrc-js-prog',
    title: 'JavaScript Programming & DOM Manipulation',
    category: 'Web Development',
    duration: '3 Months',
    feePKR: 24000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Master modern ES6+ JavaScript, dynamic DOM manipulation, async/await, and REST API integration.',
    learningObjectives: ['Write ES6+ JavaScript', 'Manipulate HTML DOM dynamically', 'Fetch REST APIs with async/await'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'ES6+ & Async JavaScript', topics: ['Arrow Functions', 'Promises & Async/Await', 'Fetch API'] }
    ],
    instructorName: 'Engr. Shahzaib Khan'
  },
  {
    id: 'gnrc-react-dev',
    title: 'React.js Modern Frontend Development',
    category: 'Web Development',
    duration: '3 Months',
    feePKR: 28000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Build single-page web applications with React hooks, state management, components, and Tailwind CSS.',
    learningObjectives: ['Build modular React components', 'Use useState & useEffect hooks', 'Style with Tailwind CSS'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'React Hooks & State Management', topics: ['Component Lifecycle', 'State & Props', 'Tailwind Integration'] }
    ],
    instructorName: 'Engr. Shahzaib Khan'
  },
  {
    id: 'gnrc-fullstack-web',
    title: 'Full-Stack Web Development Diploma',
    category: 'Web Development',
    duration: '6 Months',
    feePKR: 45000,
    registrationFeePKR: 2000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Masterclass',
    description: '6-month comprehensive full-stack engineering diploma covering React 19, Node.js, Express, PostgreSQL, and cloud deployments.',
    learningObjectives: ['Architect full-stack web applications', 'Build Node.js REST APIs', 'Deploy to cloud servers'],
    curriculumModules: [
      { week: 'Month 1-2', title: 'Frontend HTML, CSS & JS', topics: ['HTML5', 'CSS Grid', 'JavaScript ES6'] },
      { week: 'Month 3-4', title: 'React Frontend Architecture', topics: ['React Hooks', 'State Management', 'Tailwind'] },
      { week: 'Month 5-6', title: 'Node.js Backend & Database Deployment', topics: ['Express APIs', 'PostgreSQL Database', 'Cloud Run'] }
    ],
    instructorName: 'Engr. Shahzaib Khan'
  },

  // E. APP DEVELOPMENT
  {
    id: 'gnrc-android-dev',
    title: 'Android Native App Development (Kotlin)',
    category: 'App Development',
    duration: '3 Months',
    feePKR: 28000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Build native Android mobile applications with Kotlin, Android Studio, Jetpack Compose, and REST APIs.',
    learningObjectives: ['Write Kotlin code', 'Design UIs with Jetpack Compose', 'Publish Android APKs'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Kotlin & Android Studio', topics: ['Kotlin Syntax', 'Activity Lifecycle', 'Jetpack Compose UI'] }
    ],
    instructorName: 'Engr. Hassan Ali (Mobile Specialist)'
  },
  {
    id: 'gnrc-flutter-dev',
    title: 'Flutter Cross-Platform Mobile App Engineering',
    category: 'App Development',
    duration: '3 Months',
    feePKR: 30000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Build high-performance cross-platform iOS and Android apps with Dart and Flutter framework.',
    learningObjectives: ['Write Dart code', 'Build Flutter Widget trees', 'Connect Firebase & REST backends'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Dart & Flutter Widgets', topics: ['Dart OOP', 'Stateful Widgets', 'Navigation & State'] }
    ],
    instructorName: 'Engr. Hassan Ali'
  },

  // F. GAME DEVELOPMENT
  {
    id: 'gnrc-game-dev-fund',
    title: 'Game Development Fundamentals & Game Math',
    category: 'Game Development',
    duration: '3 Months',
    feePKR: 25000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Learn game loops, collision detection, 2D physics, vector math, and game logic architecture.',
    learningObjectives: ['Understand Game Loop mechanics', 'Apply vector physics in games', 'Design character collision'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Game Loop & Physics', topics: ['Delta Time', 'Vector Mathematics', 'Collision Detection'] }
    ],
    instructorName: 'Sir Ali Raza (Game Engineer)'
  },
  {
    id: 'gnrc-unity-game-dev',
    title: 'Unity Engine & C# 3D Game Development',
    category: 'Game Development',
    duration: '6 Months',
    feePKR: 42000,
    registrationFeePKR: 2000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Build 2D and 3D games with Unity Engine, C# scripting, lighting, particle systems, and audio.',
    learningObjectives: ['Script games in C#', 'Build 3D environments in Unity', 'Publish playable PC/Android games'],
    curriculumModules: [
      { week: 'Month 1-3', title: 'Unity 2D Game Mechanics', topics: ['Rigidbodies', 'C# Scripts', 'Sprite Animations'] },
      { week: 'Month 4-6', title: '3D Game Design & Publishing', topics: ['3D Lighting', 'NavMesh AI', 'Build Generation'] }
    ],
    instructorName: 'Sir Ali Raza'
  },

  // G. AI & AUTOMATION
  {
    id: 'gnrc-intro-ai',
    title: 'Introduction to Artificial Intelligence & Machine Learning',
    category: 'AI & Automation',
    duration: '3 Months',
    feePKR: 22000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Foundational AI concepts, neural networks, machine learning models, and real-world AI applications.',
    learningObjectives: ['Understand Artificial Intelligence concepts', 'Explore Neural Networks', 'Understand LLMs & Vision models'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'AI Foundations', topics: ['Supervised vs Unsupervised ML', 'Neural Network Layers', 'Generative AI'] }
    ],
    instructorName: 'Dr. Evelyn Sterling'
  },
  {
    id: 'gnrc-ai-tools',
    title: 'AI Productivity Tools & Office Automation',
    category: 'AI & Automation',
    duration: '3 Months',
    feePKR: 20000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Learn how to boost daily office and study productivity using ChatGPT, Gemini, Claude, Midjourney, and Canva AI.',
    learningObjectives: ['Use AI tools for daily tasks', 'Automate report generation', 'Create AI media assets'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'AI Productivity Suite', topics: ['Prompt Engineering', 'AI Writing Tools', 'AI Image Synthesis'] }
    ],
    instructorName: 'Dr. Evelyn Sterling'
  },
  {
    id: 'gnrc-ai-chatbot-dev',
    title: 'AI Chatbot & Virtual Assistant Development',
    category: 'AI & Automation',
    duration: '3 Months',
    feePKR: 30000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Build intelligent customer support chatbots using Gemini API, function calling, vector embeddings, and webhooks.',
    learningObjectives: ['Connect Gemini API in web apps', 'Implement function calling', 'Deploy customer chatbots'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Gemini API & Function Calling', topics: ['API Keys & Endpoints', 'Structured Tool Calling', 'RAG Retrieval'] }
    ],
    instructorName: 'Dr. Evelyn Sterling'
  },

  // H. TRADING & FINTECH
  {
    id: 'gnrc-trading-fund',
    title: 'Financial Market Trading Fundamentals',
    category: 'Trading & FinTech',
    duration: '3 Months',
    feePKR: 25000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Beginner',
    description: 'Understand global financial market concepts, order types, market participants, and risk management principles.',
    learningObjectives: ['Understand market order types', 'Calculate risk-to-reward ratios', 'Master position sizing'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Market Mechanics & Risk Control', topics: ['Order Books', 'Bid/Ask Spread', 'Stop Loss & Take Profit'] }
    ],
    instructorName: 'Sir Kamran Malik (FinTech Specialist)',
    riskWarning: 'Financial trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. GNRC does not promise financial returns or guaranteed profits.'
  },
  {
    id: 'gnrc-tech-analysis',
    title: 'Technical Analysis & Candlestick Charting',
    category: 'Trading & FinTech',
    duration: '3 Months',
    feePKR: 28000,
    registrationFeePKR: 1000,
    installmentAvailable: true,
    classType: 'Physical (On-Campus)',
    level: 'Intermediate',
    description: 'Read technical price charts, support & resistance levels, candlestick patterns, RSI, MACD, and volume indicators.',
    learningObjectives: ['Identify support & resistance levels', 'Recognize candlestick price patterns', 'Use RSI and MACD indicators'],
    curriculumModules: [
      { week: 'Week 1-4', title: 'Chart Patterns & Indicators', topics: ['Support & Resistance', 'Trendlines', 'RSI & Moving Averages'] }
    ],
    instructorName: 'Sir Kamran Malik',
    riskWarning: 'Financial trading involves substantial risk of loss and is not suitable for all investors. Past performance is not indicative of future results. GNRC does not promise financial returns or guaranteed profits.'
  }
];
