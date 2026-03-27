// Mock data for DYPIU Collab TP1 — used when Firebase is not configured
// All data is in-memory and will reset on page refresh

export const MOCK_USERS = [
  { uid: 'u1', name: 'Dr. Priya Sharma', email: 'priya.sharma@dypiu.ac.in', role: 'Admin', batch: 'Faculty', branch: 'T&P', cgpa: null, avatar: 'PS', status: 'online', placementStatus: 'N/A' },
  { uid: 'u2', name: 'Prof. Rahul Mehta', email: 'rahul.mehta@dypiu.ac.in', role: 'Faculty', batch: 'Faculty', branch: 'CS', cgpa: null, avatar: 'RM', status: 'online', placementStatus: 'N/A' },
  { uid: 'u3', name: 'Aryan Kapoor', email: 'aryan.kapoor@dypiu.ac.in', role: 'Student', batch: '2024', branch: 'CS', cgpa: 8.7, avatar: 'AK', status: 'online', placementStatus: 'Placed', skills: ['React', 'Node.js', 'Python'], github: 'github.com/aryan-kapoor', resume: '#' },
  { uid: 'u4', name: 'Sneha Patil', email: 'sneha.patil@dypiu.ac.in', role: 'Student', batch: '2024', branch: 'CS', cgpa: 9.1, avatar: 'SP', status: 'online', placementStatus: 'In Process', skills: ['Java', 'Spring Boot', 'SQL'], github: 'github.com/sneha-patil', resume: '#' },
  { uid: 'u5', name: 'Rohan Desai', email: 'rohan.desai@dypiu.ac.in', role: 'Student', batch: '2024', branch: 'IT', cgpa: 7.5, avatar: 'RD', status: 'offline', placementStatus: 'Unplaced', skills: ['HTML', 'CSS', 'JavaScript'], github: 'github.com/rohan-desai', resume: '#' },
  { uid: 'u6', name: 'Ananya Singh', email: 'ananya.singh@dypiu.ac.in', role: 'Student', batch: '2024', branch: 'MECH', cgpa: 8.2, avatar: 'AS', status: 'dnd', placementStatus: 'In Process', skills: ['AutoCAD', 'SolidWorks', 'MATLAB'], github: 'github.com/ananya-singh', resume: '#' },
  { uid: 'u7', name: 'Vikram Joshi', email: 'vikram.joshi@dypiu.ac.in', role: 'Student', batch: '2023', branch: 'CS', cgpa: 6.8, avatar: 'VJ', status: 'offline', placementStatus: 'Unplaced', skills: ['C++', 'DSA'], github: 'github.com/vikram-joshi', resume: '#' },
];

export const MOCK_CHANNELS = [
  // Announcements
  { id: 'ann-general', name: 'general-announcements', type: 'announcement', category: '📢 Announcements', isLocked: false },
  { id: 'ann-placement', name: 'placement-news', type: 'announcement', category: '📢 Announcements', isLocked: false },
  // General Chat
  { id: 'gen-tpteam', name: 'tp-team-chat', type: 'general', category: '💬 General Chat', isLocked: false },
  { id: 'gen-cs', name: 'cs-batch-2024', type: 'general', category: '💬 General Chat', isLocked: false },
  { id: 'gen-it', name: 'it-batch-2024', type: 'general', category: '💬 General Chat', isLocked: false },
  { id: 'gen-mech', name: 'mech-batch-2024', type: 'general', category: '💬 General Chat', isLocked: false },
  { id: 'gen-random', name: 'random', type: 'general', category: '💬 General Chat', isLocked: false },
  // Resources
  { id: 'res-notes', name: 'study-resources', type: 'resource', category: '📚 Resources', isLocked: false },
  { id: 'res-placement', name: 'placement-prep', type: 'resource', category: '📚 Resources', isLocked: false },
  // Admin
  { id: 'adm-ops', name: 'admin-ops', type: 'admin', category: '🔒 Admin', isLocked: true },
];

export const MOCK_MESSAGES = {
  'ann-general': [
    { id: 'm1', channelId: 'ann-general', senderId: 'u1', senderName: 'Dr. Priya Sharma', text: '🎉 Welcome to DYPIU Collab! This is your official T&P communication platform. All placement-related updates will be posted here. Please ensure your profile is complete.', timestamp: new Date(Date.now() - 86400000 * 3), reactions: { '👍': ['u3','u4','u5'], '🎉': ['u3','u4'] }, isPinned: true },
    { id: 'm2', channelId: 'ann-general', senderId: 'u1', senderName: 'Dr. Priya Sharma', text: '📅 Registration for the Google placement drive is now OPEN. Eligible students (CGPA ≥ 8.0, No backlogs, CS/IT branch) please register via the Placement Module before March 30th.', timestamp: new Date(Date.now() - 86400000), reactions: { '🙌': ['u3','u4'], '👀': ['u5'] }, isPinned: false },
    { id: 'm3', channelId: 'ann-general', senderId: 'u2', senderName: 'Prof. Rahul Mehta', text: '📝 Mock interview sessions will be held this Friday in Lab 3. Compulsory for all final year students. Register in the Timetable section.', timestamp: new Date(Date.now() - 3600000 * 5), reactions: {}, isPinned: false },
  ],
  'ann-placement': [
    { id: 'm4', channelId: 'ann-placement', senderId: 'u1', senderName: 'Dr. Priya Sharma', text: '🏆 CONGRATULATIONS! Aryan Kapoor has been placed at Google as a Software Engineer with a package of ₹22 LPA! We are incredibly proud. 🎊', timestamp: new Date(Date.now() - 86400000 * 2), reactions: { '🎉': ['u4','u5','u6','u2'], '🔥': ['u4','u5'] }, isPinned: true },
    { id: 'm5', channelId: 'ann-placement', senderId: 'u1', senderName: 'Dr. Priya Sharma', text: '📣 Infosys drive scheduled for April 5th. Package: ₹6.5 LPA. Eligibility: All branches, CGPA ≥ 6.5. Registration link shared on Placement Dashboard.', timestamp: new Date(Date.now() - 3600000 * 2), reactions: { '👍': ['u5','u6','u7'] }, isPinned: false },
  ],
  'gen-tpteam': [
    { id: 'm6', channelId: 'gen-tpteam', senderId: 'u2', senderName: 'Prof. Rahul Mehta', text: 'Hey team, the new Collab platform is live! 🚀 Let\'s move all our communication here from WhatsApp.', timestamp: new Date(Date.now() - 86400000 * 4), reactions: { '💯': ['u1'] }, isPinned: false },
    { id: 'm7', channelId: 'gen-tpteam', senderId: 'u1', senderName: 'Dr. Priya Sharma', text: 'Absolutely! I\'ve already set up all the channels. Students will be onboarded from Monday. Please share the onboarding guide.', timestamp: new Date(Date.now() - 86400000 * 4 + 3600000), reactions: {}, isPinned: false },
  ],
  'gen-cs': [
    { id: 'm8', channelId: 'gen-cs', senderId: 'u3', senderName: 'Aryan Kapoor', text: 'Anyone solved the DP problem from last week\'s quiz? The optimal substructure approach was tricky!', timestamp: new Date(Date.now() - 86400000 * 2), reactions: { '👀': ['u4'] }, isPinned: false },
    { id: 'm9', channelId: 'gen-cs', senderId: 'u4', senderName: 'Sneha Patil', text: 'Yes! The key insight is to use memoization with a 2D array. I can share my approach in the Q&A board.', timestamp: new Date(Date.now() - 86400000 * 2 + 1800000), reactions: { '🙌': ['u3'] }, isPinned: false },
    { id: 'm10', channelId: 'gen-cs', senderId: 'u2', senderName: 'Prof. Rahul Mehta', text: '📚 New DSA resources uploaded in the Study Resources channel. Focus on graphs and DP for placement season!', timestamp: new Date(Date.now() - 3600000), reactions: { '👍': ['u3','u4','u5'] }, isPinned: false },
  ],
  'gen-random': [
    { id: 'm11', channelId: 'gen-random', senderId: 'u5', senderName: 'Rohan Desai', text: 'The new platform is 🔥🔥🔥 Much better than WhatsApp groups!', timestamp: new Date(Date.now() - 86400000), reactions: { '😂': ['u3','u4'], '💯': ['u3'] }, isPinned: false },
    { id: 'm12', channelId: 'gen-random', senderId: 'u4', senderName: 'Sneha Patil', text: 'Agreed! No more "Message 1 of 97" at midnight 😅', timestamp: new Date(Date.now() - 86400000 + 1800000), reactions: { '😂': ['u3','u5','u6'] }, isPinned: false },
  ],
};

export const MOCK_RESOURCES = [
  { id: 'r1', title: 'Data Structures & Algorithms — Complete Notes', subject: 'DSA', type: 'PDF', uploadedBy: 'Prof. Rahul Mehta', uploadedAt: new Date(Date.now() - 86400000 * 7), downloadCount: 142, tags: ['DSA', 'Placement', 'CS'], fileURL: '#', size: '2.4 MB' },
  { id: 'r2', title: 'System Design Interview Guide (FAANG Level)', subject: 'Placement Prep', type: 'PDF', uploadedBy: 'Dr. Priya Sharma', uploadedAt: new Date(Date.now() - 86400000 * 5), downloadCount: 217, tags: ['System Design', 'Placement', 'Advanced'], fileURL: '#', size: '5.1 MB' },
  { id: 'r3', title: 'Resume Building Workshop — Slides', subject: 'Soft Skills', type: 'Slides', uploadedBy: 'Dr. Priya Sharma', uploadedAt: new Date(Date.now() - 86400000 * 3), downloadCount: 89, tags: ['Resume', 'Soft Skills', 'Placement'], fileURL: '#', size: '3.8 MB' },
  { id: 'r4', title: 'SQL & Database Essentials for Interviews', subject: 'Database', type: 'PDF', uploadedBy: 'Prof. Rahul Mehta', uploadedAt: new Date(Date.now() - 86400000 * 2), downloadCount: 76, tags: ['SQL', 'Database', 'CS', 'Placement'], fileURL: '#', size: '1.9 MB' },
  { id: 'r5', title: 'Operating Systems — Short Notes', subject: 'OS', type: 'PDF', uploadedBy: 'Prof. Rahul Mehta', uploadedAt: new Date(Date.now() - 86400000), downloadCount: 54, tags: ['OS', 'CS', 'Core'], fileURL: '#', size: '1.2 MB' },
  { id: 'r6', title: 'Aptitude Question Bank (500+ Questions)', subject: 'Aptitude', type: 'PDF', uploadedBy: 'Dr. Priya Sharma', uploadedAt: new Date(Date.now() - 3600000 * 12), downloadCount: 201, tags: ['Aptitude', 'Placement', 'All Branches'], fileURL: '#', size: '4.5 MB' },
];

export const MOCK_QUIZZES = [
  {
    id: 'q1',
    title: 'DSA — Arrays & Strings',
    subject: 'DSA',
    createdBy: 'Prof. Rahul Mehta',
    duration: 30, // minutes
    status: 'live',
    totalQuestions: 5,
    negativeMarking: -0.25,
    questions: [
      {
        id: 'qq1', type: 'mcq', text: 'What is the time complexity of Binary Search?',
        options: ['O(n)', 'O(log n)', 'O(n log n)', 'O(1)'],
        correct: 1, marks: 1,
        explanation: 'Binary search divides the search space in half each time, giving O(log n) complexity.',
      },
      {
        id: 'qq2', type: 'mcq', text: 'Which data structure uses LIFO (Last In First Out)?',
        options: ['Queue', 'Stack', 'Linked List', 'Tree'],
        correct: 1, marks: 1,
        explanation: 'Stack uses LIFO order — the last element pushed is the first to be popped.',
      },
      {
        id: 'qq3', type: 'mcq', text: 'What is the worst-case time complexity of QuickSort?',
        options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
        correct: 1, marks: 1,
        explanation: 'QuickSort worst case O(n²) occurs when the pivot is always the smallest/largest element.',
      },
      {
        id: 'qq4', type: 'tf', text: 'An array is a dynamic data structure that can grow in size automatically.',
        options: ['True', 'False'],
        correct: 1, marks: 1,
        explanation: 'Arrays are static in most languages — they have a fixed size defined at creation.',
      },
      {
        id: 'qq5', type: 'mcq', text: 'Which algorithm is used to find the shortest path in a weighted graph?',
        options: ["BFS", "DFS", "Dijkstra's Algorithm", "Kruskal's Algorithm"],
        correct: 2, marks: 1,
        explanation: "Dijkstra's algorithm finds shortest paths from a source node in weighted graphs with non-negative edges.",
      },
    ],
  },
  {
    id: 'q2',
    title: 'Verbal Aptitude — Mock Test 1',
    subject: 'Aptitude',
    createdBy: 'Dr. Priya Sharma',
    duration: 20,
    status: 'upcoming',
    totalQuestions: 5,
    negativeMarking: 0,
    questions: [],
  },
  {
    id: 'q3',
    title: 'SQL Fundamentals',
    subject: 'Database',
    createdBy: 'Prof. Rahul Mehta',
    duration: 25,
    status: 'completed',
    totalQuestions: 5,
    negativeMarking: -0.25,
    questions: [],
  },
];

export const MOCK_PLACEMENT_DRIVES = [
  { id: 'd1', company: 'Google', logo: 'G', color: '#4285F4', date: new Date(Date.now() + 86400000 * 3), role: 'Software Engineer', ctcRange: '₹18-22 LPA', eligibility: { cgpa: 8.0, branches: ['CS','IT'], backlogs: 0 }, status: 'Upcoming', registeredCount: 24, totalOffers: 0 },
  { id: 'd2', company: 'Microsoft', logo: 'M', color: '#00A4EF', date: new Date(Date.now() + 86400000 * 7), role: 'SDE - 1', ctcRange: '₹20-25 LPA', eligibility: { cgpa: 7.5, branches: ['CS','IT','ECE'], backlogs: 0 }, status: 'Upcoming', registeredCount: 31, totalOffers: 0 },
  { id: 'd3', company: 'Infosys', logo: 'I', color: '#007CC3', date: new Date(Date.now() + 86400000 * 10), role: 'Systems Engineer', ctcRange: '₹6.5 LPA', eligibility: { cgpa: 6.5, branches: ['CS','IT','MECH','EE'], backlogs: 0 }, status: 'Open', registeredCount: 87, totalOffers: 0 },
  { id: 'd4', company: 'TCS', logo: 'T', color: '#5BBFBE', date: new Date(Date.now() - 86400000 * 10), role: 'Assistant Systems Engineer', ctcRange: '₹3.36 LPA', eligibility: { cgpa: 6.0, branches: ['CS','IT','MECH','EE','ME'], backlogs: 0 }, status: 'Completed', registeredCount: 112, totalOffers: 18 },
  { id: 'd5', company: 'Amazon', logo: 'A', color: '#FF9900', date: new Date(Date.now() - 86400000 * 5), role: 'SDE - 1', ctcRange: '₹16-20 LPA', eligibility: { cgpa: 7.0, branches: ['CS','IT'], backlogs: 0 }, status: 'Completed', registeredCount: 45, totalOffers: 5 },
];

export const MOCK_PLACEMENT_STATS = {
  totalStudents: 420,
  totalPlaced: 187,
  totalOffers: 214,
  avgCTC: 8.4,
  highestCTC: 32,
  companiesVisited: 28,
  drivesFunnel: {
    applied: 312,
    tested: 218,
    interviewing: 94,
    placed: 187,
  },
  monthlyTrend: [
    { month: 'Aug', placed: 5 },
    { month: 'Sep', placed: 12 },
    { month: 'Oct', placed: 28 },
    { month: 'Nov', placed: 45 },
    { month: 'Dec', placed: 38 },
    { month: 'Jan', placed: 31 },
    { month: 'Feb', placed: 20 },
    { month: 'Mar', placed: 8 },
  ],
  branchStats: [
    { branch: 'CS', total: 120, placed: 89, percentage: 74 },
    { branch: 'IT', total: 90, placed: 61, percentage: 68 },
    { branch: 'MECH', total: 80, placed: 22, percentage: 28 },
    { branch: 'ECE', total: 70, placed: 12, percentage: 17 },
    { branch: 'EE', total: 60, placed: 3, percentage: 5 },
  ],
};

export const MOCK_ATTENDANCE = {
  'u3': [
    { date: '2026-03-01', subject: 'DSA', status: 'present' },
    { date: '2026-03-02', subject: 'OS', status: 'present' },
    { date: '2026-03-03', subject: 'Mock Interview', status: 'present' },
    { date: '2026-03-04', subject: 'DSA', status: 'absent' },
    { date: '2026-03-05', subject: 'Soft Skills', status: 'present' },
    { date: '2026-03-07', subject: 'DSA', status: 'present' },
    { date: '2026-03-08', subject: 'OS', status: 'present' },
    { date: '2026-03-09', subject: 'Mock Interview', status: 'absent' },
    { date: '2026-03-10', subject: 'DSA', status: 'present' },
    { date: '2026-03-11', subject: 'Soft Skills', status: 'present' },
  ],
};

export const MOCK_TIMETABLE = [
  { day: 'Monday', sessions: [
    { time: '09:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Prof. Rahul Mehta', room: 'Lab 2', type: 'lecture' },
    { time: '11:00 AM', subject: 'Mock Aptitude Test', faculty: 'Dr. Priya Sharma', room: 'Online', type: 'assessment' },
    { time: '02:00 PM', subject: 'Resume Workshop', faculty: 'Dr. Priya Sharma', room: 'Seminar Hall', type: 'workshop' },
  ]},
  { day: 'Tuesday', sessions: [
    { time: '10:00 AM', subject: 'Operating Systems', faculty: 'Prof. Rahul Mehta', room: 'CR 101', type: 'lecture' },
    { time: '02:00 PM', subject: 'System Design', faculty: 'Prof. Rahul Mehta', room: 'Lab 3', type: 'lecture' },
  ]},
  { day: 'Wednesday', sessions: [
    { time: '09:00 AM', subject: 'Database Management', faculty: 'Prof. Rahul Mehta', room: 'Lab 1', type: 'lecture' },
    { time: '11:00 AM', subject: 'Group Discussion Practice', faculty: 'Dr. Priya Sharma', room: 'Seminar Hall', type: 'workshop' },
    { time: '02:00 PM', subject: 'Coding Contest', faculty: 'Prof. Rahul Mehta', room: 'Online', type: 'assessment' },
  ]},
  { day: 'Thursday', sessions: [
    { time: '10:00 AM', subject: 'Data Structures & Algorithms', faculty: 'Prof. Rahul Mehta', room: 'Lab 2', type: 'lecture' },
    { time: '02:00 PM', subject: 'Mock Interview', faculty: 'Hr. Panelist', room: 'Interview Room', type: 'workshop' },
  ]},
  { day: 'Friday', sessions: [
    { time: '09:00 AM', subject: 'Soft Skills', faculty: 'Dr. Priya Sharma', room: 'Seminar Hall', type: 'lecture' },
    { time: '11:00 AM', subject: 'Weekly Quiz', faculty: 'Prof. Rahul Mehta', room: 'Online', type: 'assessment' },
    { time: '02:00 PM', subject: 'Project Review', faculty: 'Prof. Rahul Mehta', room: 'Lab 3', type: 'workshop' },
  ]},
];

export const MOCK_GRIEVANCES = [
  { id: 'g1', studentId: 'u3', isAnonymous: false, subject: 'Request for additional study material', description: 'I would like to request additional practice problems for System Design topics to better prepare for FAANG interviews.', status: 'Resolved', createdAt: new Date(Date.now() - 86400000 * 5), responses: [{ by: 'Dr. Priya Sharma', text: 'Added a comprehensive System Design guide to the Resources channel. Please check!', at: new Date(Date.now() - 86400000 * 4) }] },
  { id: 'g2', studentId: 'u5', isAnonymous: true, subject: 'Timetable conflict for mock interviews', description: 'The mock interview schedule clashes with the OS lab. Can it be rescheduled?', status: 'In Progress', createdAt: new Date(Date.now() - 86400000 * 2), responses: [{ by: 'Prof. Rahul Mehta', text: 'We are looking into this and will update the timetable shortly.', at: new Date(Date.now() - 86400000) }] },
  { id: 'g3', studentId: 'u6', isAnonymous: false, subject: 'Attendance marked incorrectly on March 10', description: 'I was present in the Soft Skills session on March 10 but my attendance shows absent. Please correct this.', status: 'Open', createdAt: new Date(Date.now() - 3600000 * 8), responses: [] },
];

export const MOCK_AUDIT_LOGS = [
  { id: 'al1', actorId: 'u1', actorName: 'Dr. Priya Sharma', action: 'USER_ROLE_CHANGED', targetId: 'u3', targetType: 'user', timestamp: new Date(Date.now() - 86400000 * 3), metadata: { from: 'Student', to: 'Placed' } },
  { id: 'al2', actorId: 'u1', actorName: 'Dr. Priya Sharma', action: 'MESSAGE_PINNED', targetId: 'm1', targetType: 'message', timestamp: new Date(Date.now() - 86400000 * 2), metadata: { channel: 'ann-general' } },
  { id: 'al3', actorId: 'u1', actorName: 'Dr. Priya Sharma', action: 'RESOURCE_UPLOADED', targetId: 'r2', targetType: 'resource', timestamp: new Date(Date.now() - 86400000), metadata: { title: 'System Design Interview Guide' } },
  { id: 'al4', actorId: 'u1', actorName: 'Dr. Priya Sharma', action: 'QUIZ_CREATED', targetId: 'q1', targetType: 'quiz', timestamp: new Date(Date.now() - 86400000 * 4), metadata: { title: 'DSA Arrays & Strings' } },
  { id: 'al5', actorId: 'u2', actorName: 'Prof. Rahul Mehta', action: 'ANNOUNCEMENT_POSTED', targetId: 'm3', targetType: 'message', timestamp: new Date(Date.now() - 3600000 * 5), metadata: { channel: 'ann-general' } },
];

export const DLP_PATTERNS = [
  { pattern: /[2-9]{1}[0-9]{3}\s[0-9]{4}\s[0-9]{4}/g, type: 'AADHAAR', severity: 'block', label: 'Aadhaar Number' },
  { pattern: /[A-Z]{5}[0-9]{4}[A-Z]{1}/g, type: 'PAN', severity: 'block', label: 'PAN Card Number' },
  { pattern: /\b4[0-9]{12}(?:[0-9]{3})?\b|\b5[1-5][0-9]{14}\b/g, type: 'CREDIT_CARD', severity: 'block', label: 'Credit/Debit Card' },
  { pattern: /\b[6-9]\d{9}\b/g, type: 'PHONE', severity: 'warn', label: 'Phone Number' },
  { pattern: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, type: 'EMAIL', severity: 'warn', label: 'Email Address' },
];
