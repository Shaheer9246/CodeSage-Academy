// src/data/exams/fundamentals.ts

import { ExamTrack } from './python';

export const fundamentalsTrack: ExamTrack = {
  id: 'network',
  title: 'Network & Computer Fundamentals',
  description: 'Test your knowledge on hardware basics, the OSI Model, TCP/IP, routing, and switching.',
  totalAvailable: 12,
  questions: [
    // --- EASY ---
    {
      topic: 'Hardware Basics',
      difficulty: 'Easy',
      q: 'What does CPU stand for?',
      options: ['Central Processing Unit', 'Computer Personal Unit', 'Central Program Utility', 'Core Processing Unit'],
      answer: 0
    },
    {
      topic: 'Hardware Basics',
      difficulty: 'Easy',
      q: 'Which of the following is considered volatile memory?',
      options: ['Hard Drive', 'Solid State Drive (SSD)', 'RAM', 'ROM'],
      answer: 2
    },
    {
      topic: 'Networking Basics',
      difficulty: 'Easy',
      q: 'What is the default port number for secure web traffic (HTTPS)?',
      options: ['21', '22', '80', '443'],
      answer: 3
    },
    {
      topic: 'Networking Basics',
      difficulty: 'Easy',
      q: 'What does DNS stand for?',
      options: ['Domain Name System', 'Digital Network Service', 'Data Name Server', 'Domain Network System'],
      answer: 0
    },

    // --- INTERMEDIATE ---
    {
      topic: 'OSI Model',
      difficulty: 'Intermediate',
      q: 'How many layers are there in the OSI model?',
      options: ['5', '6', '7', '4'],
      answer: 2
    },
    {
      topic: 'Protocols',
      difficulty: 'Intermediate',
      q: 'Which protocol is responsible for dynamically assigning IP addresses to devices on a network?',
      options: ['DNS', 'DHCP', 'FTP', 'SMTP'],
      answer: 1
    },
    {
      topic: 'Routing & Switching',
      difficulty: 'Intermediate',
      q: 'At which OSI layer does a standard Network Switch operate?',
      options: ['Layer 1 (Physical)', 'Layer 2 (Data Link)', 'Layer 3 (Network)', 'Layer 4 (Transport)'],
      answer: 1
    },
    {
      topic: 'Addressing',
      difficulty: 'Intermediate',
      q: 'What is the loopback IP address for localhost in IPv4?',
      options: ['192.168.1.1', '127.0.0.1', '10.0.0.1', '255.255.255.0'],
      answer: 1
    },

    // --- HARD ---
    {
      topic: 'TCP/IP',
      difficulty: 'Hard',
      q: 'Which of the following describes the correct sequence of a TCP 3-way handshake?',
      options: [
        'SYN, ACK, SYN-ACK',
        'SYN, SYN-ACK, ACK',
        'ACK, SYN-ACK, SYN',
        'SYN-ACK, SYN, ACK'
      ],
      answer: 1
    },
    {
      topic: 'Subnetting',
      difficulty: 'Hard',
      q: 'How many usable host IP addresses are available in a /24 subnet?',
      options: ['256', '255', '254', '128'],
      answer: 2
    },
    {
      topic: 'Advanced Routing',
      difficulty: 'Hard',
      q: 'Which of the following is a path-vector routing protocol commonly used to route traffic across the internet backbone?',
      options: ['OSPF', 'EIGRP', 'RIP', 'BGP'],
      answer: 3
    },
    {
      topic: 'Security',
      difficulty: 'Hard',
      q: 'What kind of attack specifically targets the Address Resolution Protocol (ARP) cache on a local area network?',
      options: ['SQL Injection', 'ARP Spoofing/Poisoning', 'Cross-Site Scripting (XSS)', 'DDoS Attack'],
      answer: 1
    }
  ]
};
