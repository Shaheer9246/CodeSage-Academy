export interface Concept {
  title: string;
  beginner: string;   // Simple, engaging real-world analogies (no dry textbook jargon)
  advanced: string;   // Technical depth: exact terminal commands, protocols, flags, attack vectors, defense mechanisms, KERNEL internals
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctIndex: number; // 0-based
  explanation: string;  // Detailed explanation of why this answer is correct, including edge cases and mitigation strategies
}

export interface CyberLesson {
  id: string;          // 'cyber-1', 'cyber-2', etc.
  module: string;      // 'Module 1: Foundations & Security Mindset'
  order: number;
  title: string;
  icon: string;        // Relevant emoji (e.g. '🛡️', '🐧', '🔐')
  terminalNotice?: string; // Optional tip e.g. "Pro Tip: Always practice on authorized lab environments."
  philosophy: string;  // Engaging hacker mindset intro (2-3 paragraphs)
  concepts: Concept[]; // 3 to 4 detailed concepts per lesson
  practical: {
    title: string;
    intro: string;
    steps: string[];   // Step-by-step hands-on terminal commands (complex chains, debugging, forensics)
    goal: string;
  };
  quiz: QuizQuestion[]; // 3 realistic scenario-based quiz questions
  keyTakeaways: string[]; // 4 to 5 practical takeaways
}

export const CYBER_LESSONS: CyberLesson[] = [
  {
    "id": "cyber-1",
    "module": "Module 1: Foundations & Security Mindset",
    "order": 1,
    "title": "The Hacker Mindset & Deep Dive into CIA Triad",
    "icon": "🧠",
    "terminalNotice": "Context: This lesson bridges theory with architecture. Understanding these models is prerequisite for reading RFCs and analyzing traffic.",
    "philosophy": "Hacking is not magic; it is applied physics and logic. A beginner sees a login box. An expert sees an HTTP POST request hitting a backend controller, triggering a database query, potentially vulnerable to SQL injection if parameterized queries aren't used. \n\nTo master cybersecurity, you must internalize the **CIA Triad** not as buzzwords, but as architectural constraints. Every security control exists to preserve one of these three states. When you analyze a breach, you are diagnosing which pillar collapsed. Was it Confidentiality (data leaked)? Integrity (data manipulated)? Or Availability (service denied)?",
    "concepts": [
      {
        "title": "Deep Dive: The CIA Triad & Threat Modeling",
        "beginner": "Think of a bank vault:\n- **Confidentiality**: Only the manager has the key. Guards don't peek at deposit boxes.\n- **Integrity**: If money is moved, the ledger updates instantly. No one can erase a transaction history.\n- **Availability**: The vault door opens during business hours. If it jams, customers riot.\n\nIn cyber, we apply this to data flows. If a hacker changes your bank balance from $100 to $1,000,000, they violated **Integrity**. If they steal your password hash, they violated **Confidentiality**.",
        "advanced": "Advanced practitioners use **STRIDE** or **DREAD** models to quantify risks within the CIA framework.\n- **Confidentiality Breaches**: \n  - *Vector*: Side-channel attacks (timing analysis, power consumption), Memory scraping (Cold Boot Attacks), Traffic Analysis (correlating packet sizes/timing to infer content even if encrypted).\n  - *Defense*: AES-GCM (Authenticated Encryption), Constant-time algorithms to prevent timing leaks, Physical security modules (HSMs).\n- **Integrity Violations**: \n  - *Vector*: Man-in-the-Middle (MitM) altering packets in transit, Supply Chain Compromise (malicious update), Race Conditions (TOCTOU bugs where state changes between check and use).\n  - *Defense*: HMAC-SHA256 signatures, Digital Signatures (RSA/ECDSA), Immutable Infrastructure (containers rebuilt from trusted images), Write-Ahead Logging (WAL) for databases.\n- **Availability Failures**: \n  - *Vector*: Volumetric DDoS (UDP Floods), Protocol Exploits (SYN Floods exhausting connection tables), Logic Bugs (infinite loops in API endpoints), Ransomware (encrypting disks).\n  - *Defense*: Rate Limiting (Token Bucket algorithm), Anycast routing for geographic redundancy, Air-gapped backups, Chaos Engineering (Gremlin/LitmusChaos) to test resilience proactively."
      },
      {
        "title": "Red vs. Blue vs. Purple: Beyond Roles to Capabilities",
        "beginner": "It's not just about who wears the hat. It's about the **mindset**.\n- **Red Team**: Thinks like a criminal. \"How do I get in without being seen?\" They care about stealth and impact.\n- **Blue Team**: Thinks like a guard. \"Did anything weird happen?\" They care about visibility and response time.\n- **Purple Team**: The translator. They ensure Red's findings are actually detectable by Blue's tools. Without Purple, Red finds holes Blue never knew existed, and Blue builds walls around threats that don't exist.",
        "advanced": "Modern security operations rely on **Detection-as-Code** and **Adversary Emulation**.\n- **Red Team Ops**: \n  - Uses MITRE ATT&CK Framework to map TTPs (Tactics, Techniques, Procedures). \n  - Example Technique: *T1059 Command and Scripting Interpreter*. Red teamers avoid PowerShell (heavily monitored) and use Python/Bash scripts executed via WMI or SSH to blend in.\n  - Goal: Prove Business Impact (exfiltrate dummy PII, encrypt non-prod DBs).\n- **Blue Team Ops**: \n  - Focuses on **MTTD** (Mean Time To Detect) and **MTTR** (Mean Time To Respond).\n  - Tools: SIEM (Splunk/Elastic) ingesting logs from EDR (CrowdStrike/SentinelOne). \n  - Challenge: Alert Fatigue. Experts tune rules to reduce False Positives while maintaining sensitivity.\n- **Purple Team Integration**: \n  - Continuous Validation Platform (CVP) approach. \n  - Workflow: Red executes *specific* technique -> Blue checks if SIEM alerted -> If no alert, Blue writes new Sigma Rule/YARA rule -> Red re-tests. \n  - Outcome: Measurable improvement in detection coverage mapped to ATT&CK matrix."
      },
      {
        "title": "The Cyber Kill Chain vs. MITRE ATT&CK Matrix",
        "beginner": "Lockheed Martin's **Kill Chain** is linear: Recon -> Weaponization -> Delivery -> Exploitation -> Installation -> C2 -> Actions on Objectives. It's great for understanding the lifecycle of a targeted attack.\n\nHowever, modern hackers don't always follow a straight line. They loop back. That's why we use **MITRE ATT&CK**, which is a knowledge base of behaviors, not just steps. It helps us ask: \"What did they *do*, not just where are they *now*?\"",
        "advanced": "Understanding the difference is critical for Incident Response (IR).\n- **Kill Chain Weaknesses**: Assumes a single vector. Doesn't account for insider threats or supply chain compromises well.\n- **ATT&CK Strengths**: \n  - Hierarchical: Tactics (High level goals, e.g., \"Initial Access\") -> Techniques (Specific methods, e.g., \"Phishing\") -> Sub-techniques (Details, e.g., \"Spearphishing Attachment\").\n  - Mitigations: Each technique links to specific defenses (e.g., Disable macros, Email filtering).\n  \n  **Example Scenario**: \n  1. Attacker uses *T1566 Phishing* (Delivery).\n  2. Victim clicks link, executing *T1059.001 PowerShell* (Execution).\n  3. Script downloads payload, establishing *T1071 Application Layer Protocol* (C2) over HTTPS to look normal.\n  4. Defender detects unusual PowerShell child process spawned by Outlook (*Process Tree Analysis*).\n  \n  **Expert Insight**: Don't just block IPs. Block *behaviors*. If a web server spawns a shell, that's anomalous regardless of the IP source."
      }
    ],
    "practical": {
      "title": "First Steps in the Security Lab",
      "intro": "As an ethical hacker, your first step is always checking your analyst identity and operating environment.",
      "steps": [
        "whoami",
        "uname",
        "cat /etc/issue"
      ],
      "goal": "Verify your security workstation environment and confirm root/user privileges."
    },
    "quiz": [
      {
        "question": "An attacker modifies a JavaScript file hosted on a CDN to inject a crypto-miner. Users visiting the site unknowingly mine coins. Which CIA pillar is primarily violated?",
        "options": [
          "Confidentiality",
          "Integrity",
          "Availability",
          "Non-repudiation"
        ],
        "correctIndex": 1,
        "explanation": "Integrity is violated because the asset (JS file) was altered without authorization. While availability might degrade slightly due to CPU usage, the root cause is the unauthorized modification of code. Defense: Subresource Integrity (SRI) hashes."
      },
      {
        "question": "In the context of MITRE ATT&CK, what is the difference between a \"Tactic\" and a \"Technique\"?",
        "options": [
          "Tactics are tools; Techniques are actions.",
          "Tactics represent the attacker's goal (why); Techniques represent the method (how).",
          "Techniques are automated; Tactics are manual.",
          "There is no difference; they are synonyms."
        ],
        "correctIndex": 1,
        "explanation": "Tactics are high-level objectives (e.g., Initial Access, Exfiltration). Techniques are the specific implementations to achieve those tactics (e.g., Valid Accounts, Data Transfer Size Limits)."
      },
      {
        "question": "A company implements MFA (Multi-Factor Authentication). This primarily strengthens which aspect of security?",
        "options": [
          "Availability of services",
          "Integrity of data",
          "Confidentiality of credentials/access",
          "Performance of login"
        ],
        "correctIndex": 2,
        "explanation": "MFA ensures that possessing a password (something you know) is insufficient. It adds \"something you have\" or \"are,\" protecting the confidentiality of access. Even if a password is leaked (Confidentiality breach of credential), the account remains secure."
      }
    ],
    "keyTakeaways": [
      "CIA is not static; it is a dynamic balance of trade-offs.",
      "Red Teams emulate adversaries using frameworks like ATT&CK to test specific detections.",
      "HTTP Headers are a primary indicator of security maturity (HSTS, CSP, X-Frame-Options).",
      "Understanding the difference between Behavior (ATT&CK) and Lifecycle (Kill Chain) improves IR strategy.",
      "Security is about reducing the attack surface, not eliminating risk entirely."
    ]
  },
  {
    "id": "cyber-16",
    "module": "Module 1: Foundations & Security Mindset",
    "order": 2,
    "title": "Hashing vs Encryption vs Encoding",
    "icon": "🔐",
    "terminalNotice": "Hashing is one-way. Encryption is two-way. Encoding is not security.",
    "philosophy": "Confusion between these three concepts leads to critical security failures.",
    "concepts": [
      {
        "title": "Encoding: Not Security",
        "beginner": "Encoding is like translating English to Morse code. It’s reversible and has no secret key. Base64 is common. It’s used to make binary data readable in text formats. But it’s not encryption! Anyone can decode Base64. Never use it to hide passwords.",
        "advanced": "Encoding transforms data format for compatibility (e.g., binary to ASCII).\n- **Base64:** Encodes 3 bytes into 4 ASCII characters. Reversible without key.\n- **URL Encoding:** `%20` for space.\n- **Hex:** Binary to hexadecimal string.\n\n**Security Risk:** Developers sometimes Base64 encode sensitive data, thinking it’s hidden. It is trivially decoded (`echo 'cGFzc3dvcmQ=' | base64 -d`)."
      },
      {
        "title": "Hashing: One-Way Fingerprints",
        "beginner": "Hashing turns data into a fixed-length string (fingerprint). You can’t turn the fingerprint back into the original data. It’s used to verify integrity. If you hash a password, the server stores the hash. When you log in, it hashes your input and compares. MD5 and SHA-1 are broken; use SHA-256 or bcrypt. Salting adds random data to passwords before hashing to stop rainbow tables.",
        "advanced": "Hash Functions: Deterministic, one-way, fixed output length.\n- **MD5/SHA-1:** Broken (collisions found). Do not use for security.\n- **SHA-256/512:** Secure for integrity checks.\n- **bcrypt/scrypt/Argon2:** Designed for passwords. Slow by design to resist brute-force.\n\n**Salting:**\nRandom data added to password before hashing. Prevents Rainbow Table attacks (precomputed hash dictionaries). Each user gets a unique salt.\n`hash = bcrypt(password + salt)`"
      },
      {
        "title": "Encryption: Two-Way with Keys",
        "beginner": "Encryption scrambles data so only someone with the key can read it. Symmetric encryption (AES) uses one key for locking and unlocking. Asymmetric (RSA) uses a public key to lock and a private key to unlock. Encryption is reversible; hashing is not. Use AES for files, RSA for key exchange.",
        "advanced": "**Symmetric (AES):**\nSingle shared key. Fast. Used for bulk data encryption. Key distribution is the challenge.\n\n**Asymmetric (RSA/ECC):**\nKey pair: Public (encrypt) and Private (decrypt). Slower. Used for key exchange and digital signatures.\n\n**Hybrid Systems:**\nTLS uses RSA/ECC to exchange a symmetric AES session key, then uses AES for data transfer. Combines security of asymmetric with speed of symmetric."
      }
    ],
    "practical": {
      "title": "Hashing & Encoding Demonstration",
      "intro": "Compare Base64 encoding, SHA-256 hashing, and bcrypt password hashing to understand their differences.",
      "steps": [
        "Encode 'password' to Base64: `echo -n 'password' | base64`. Decode it back.\n",
        "Hash 'password' with SHA-256: `echo -n 'password' | sha256sum`. Note fixed length.\n",
        "Hash 'password' with bcrypt (using online tool or library). Note randomness/salt.\n",
        "Compare outputs: Base64 is reversible; SHA-256 is fixed; bcrypt is slow and salted."
      ],
      "goal": "Differentiate between encoding, hashing, and encryption through practical examples."
    },
    "quiz": [
      {
        "question": "Is Base64 encryption?",
        "options": [
          "Yes",
          "No, it is encoding",
          "Only for passwords",
          "Only for images"
        ],
        "correctIndex": 1,
        "explanation": "Base64 is encoding, not encryption. It is reversible without a key and provides no confidentiality. It is used for data format compatibility."
      },
      {
        "question": "Why is salting important for password hashing?",
        "options": [
          "It makes hashes shorter",
          "It prevents Rainbow Table attacks",
          "It speeds up hashing",
          "It encrypts the password"
        ],
        "correctIndex": 1,
        "explanation": "Salting adds unique random data to each password before hashing. This ensures identical passwords have different hashes, defeating precomputed Rainbow Tables."
      },
      {
        "question": "Which algorithm is suitable for password storage?",
        "options": [
          "MD5",
          "SHA-1",
          "bcrypt",
          "Base64"
        ],
        "correctIndex": 2,
        "explanation": "bcrypt is designed for passwords. It is slow by design (work factor) to resist brute-force attacks and includes built-in salting. MD5/SHA-1 are too fast and broken."
      }
    ],
    "keyTakeaways": [
      "Encoding (Base64) is reversible and not secure.",
      "Hashing (SHA-256, bcrypt) is one-way and used for integrity/passwords.",
      "Encryption (AES, RSA) is reversible with keys.",
      "Always salt passwords to prevent Rainbow Table attacks."
    ]
  },
  {
    "id": "cyber-18",
    "module": "Module 1: Foundations & Security Mindset",
    "order": 3,
    "title": "Password Attacks & Modern Auth Defenses",
    "icon": "🔑",
    "terminalNotice": "Brute-forcing is illegal without authorization. Use strong passwords and MFA.",
    "philosophy": "Passwords are the weakest link. Defense requires layers.",
    "concepts": [
      {
        "title": "Dictionary & Brute-Force Attacks",
        "beginner": "Hackers don’t guess randomly. They use dictionaries of common passwords (like 'password123') from leaks like RockYou. Dictionary attacks try these lists quickly. Brute-force tries every combination (aaaa, aaab...). Credential Stuffing uses leaked username/password pairs from other sites. If you reuse passwords, you’re vulnerable.",
        "advanced": "**Attack Types:**\n- **Dictionary:** Uses wordlists (RockYou.txt, SecLists). Fast, high success rate for weak passwords.\n- **Brute-Force:** Exhaustive key search. Computationally expensive. Mitigated by lockouts.\n- **Credential Stuffing:** Automated login attempts using breached credential pairs. Exploits password reuse.\n- **Rainbow Tables:** Precomputed hash tables for reversing unsalted hashes. Defeated by salting.\n\n**Tools:** Hydra, John the Ripper, Hashcat."
      },
      {
        "title": "Rate Limiting & Lockout Policies",
        "beginner": "To stop brute-force, servers limit how many times you can guess. Rate limiting slows down attempts. Account lockout disables the account after 5 failed tries. But lockouts can be used for Denial of Service (locking out users). Smart systems use CAPTCHA or progressive delays instead.",
        "advanced": "**Defense Mechanisms:**\n- **Rate Limiting:** Restricts requests per IP/user (e.g., 5/min). Throttles attacks.\n- **Account Lockout:** Disables account after N failures. Risk: DoS vector.\n- **Progressive Delay:** Increases wait time after each failure.\n- **CAPTCHA:** Distinguishes humans from bots.\n- **IP Blocking:** Temporarily bans IPs with high failure rates.\n\n**Best Practice:** Combine rate limiting with CAPTCHA and monitoring. Avoid hard lockouts for high-value targets."
      },
      {
        "title": "Multi-Factor Authentication (MFA)",
        "beginner": "MFA requires two things: something you know (password) and something you have (phone/app). TOTP (Time-Based One-Time Password) apps like Google Authenticator generate codes every 30 seconds. Even if hackers steal your password, they can’t log in without the code. SMS is weak (SIM swapping); apps are better.",
        "advanced": "**MFA Factors:**\n- **Knowledge:** Password/PIN.\n- **Possession:** TOTP app, Hardware token (YubiKey), SMS (weak).\n- **Inherence:** Biometrics (fingerprint).\n\n**TOTP (RFC 6238):**\nGenerates 6-digit code based on shared secret and current time. Synced between server and app.\n\n**FIDO2/WebAuthn:**\nPasswordless authentication using public key cryptography. Phishing-resistant. Hardware keys provide highest security."
      }
    ],
    "practical": {
      "title": "Simulating Password Strength & MFA",
      "intro": "Test password strength against a dictionary and configure TOTP for a demo account.",
      "steps": [
        "Use a password strength checker to test common passwords vs complex ones.\n",
        "Simulate a dictionary attack (educational tool) against a hashed password list.\n",
        "Set up Google Authenticator for a demo service. Scan QR code.\n",
        "Observe TOTP code generation every 30 seconds. Understand time-sync requirement."
      ],
      "goal": "Understand password vulnerabilities and the mechanics of TOTP MFA."
    },
    "quiz": [
      {
        "question": "What is Credential Stuffing?",
        "options": [
          "Guessing passwords randomly",
          "Using leaked username/password pairs from other sites",
          "Breaking encryption",
          "Stealing cookies"
        ],
        "correctIndex": 1,
        "explanation": "Credential stuffing uses automated tools to test breached username/password combinations on other sites, exploiting password reuse."
      },
      {
        "question": "Why is SMS-based MFA considered weak?",
        "options": [
          "It is too slow",
          "Vulnerable to SIM swapping and interception",
          "It uses weak encryption",
          "It requires internet"
        ],
        "correctIndex": 1,
        "explanation": "SMS is vulnerable to SIM swapping (attacker transfers victim’s number) and SS7 protocol interception. TOTP apps or hardware keys are more secure."
      },
      {
        "question": "How does rate limiting defend against brute-force?",
        "options": [
          "It encrypts passwords",
          "It restricts the number of attempts per time period",
          "It deletes accounts",
          "It hides the login page"
        ],
        "correctIndex": 1,
        "explanation": "Rate limiting throttles login attempts (e.g., 5 per minute), making brute-force attacks computationally impractical due to time constraints."
      }
    ],
    "keyTakeaways": [
      "Dictionary attacks exploit weak passwords; Credential Stuffing exploits reuse.",
      "Rate limiting and CAPTCHA mitigate brute-force.",
      "MFA (TOTP/FIDO2) adds a critical second layer of defense.",
      "SMS MFA is vulnerable; prefer authenticator apps or hardware keys."
    ]
  },
  {
    "id": "cyber-11",
    "module": "Module 2: How the Web & Attacks Work",
    "order": 4,
    "title": "How the Web Works for Hackers",
    "icon": "🌐",
    "terminalNotice": "Inspecting your own browser traffic is safe. Do not intercept or modify traffic to third-party sites without permission.",
    "philosophy": "The web is just text moving back and forth. If you can read the conversation, you can change it.",
    "concepts": [
      {
        "title": "HTTP Methods: The Verbs of the Web",
        "beginner": "Think of HTTP methods as verbs in a sentence. GET is 'read this page.' POST is 'submit this form.' PUT is 'update this record.' DELETE is 'remove this item.' Most websites only use GET and POST, but developers sometimes leave PUT and DELETE open by mistake. If a hacker finds an open DELETE method on a user profile URL, they might be able to delete accounts just by sending the right command.",
        "advanced": "HTTP/1.1 defines several request methods (RFC 7231):\n- **GET**: Retrieves resources. Idempotent (safe to retry). Parameters visible in URL query strings.\n- **POST**: Submits data to be processed. Non-idempotent. Data in request body (not logged in server access logs by default).\n- **PUT**: Replaces target resource with request payload. Idempotent.\n- **DELETE**: Removes target resource. Idempotent.\n- **PATCH**: Partial modification.\n- **OPTIONS**: Returns supported methods (CORS preflight).\n\n**Security Risk:** Improper implementation of PUT/DELETE can lead to Unauthorized Resource Modification. Attackers use `curl -X DELETE https://target.com/api/user/1` to test. Defense: Explicitly disable unused methods in web server config (e.g., Apache `LimitExcept GET POST`)."
      },
      {
        "title": "Headers & Status Codes: The Metadata",
        "beginner": "Every web request has a header, like the envelope of a letter. It tells the server who you are, what browser you use, and what language you speak. The server replies with a status code: 200 means 'OK,' 404 means 'Not Found,' 403 means 'Forbidden,' and 500 means 'Server Error.' Hackers look for 500 errors because they often reveal database details or code paths. They also look for 403 Forbidden pages to see if they can bypass them by changing headers.",
        "advanced": "**Key Request Headers:**\n- `Host`: Target domain (virtual hosting).\n- `User-Agent`: Client identity (often spoofed for testing).\n- `Cookie`: Session tokens.\n- `Authorization`: Bearer tokens or Basic Auth credentials.\n- `X-Forwarded-For`: Original client IP (if behind proxy). Spoofable.\n\n**Key Response Headers:**\n- `Set-Cookie`: Issues session cookie.\n- `Content-Type`: MIME type of response.\n- `X-Powered-By`: Leaks server technology (e.g., Express, PHP/7.4). Security risk.\n- `Strict-Transport-Security`: Enforces HTTPS.\n\n**Status Codes:**\n- **2xx (Success):** 200 OK, 201 Created, 204 No Content.\n- **3xx (Redirection):** 301 Permanent, 302 Temporary (open redirect vulnerability).\n- **4xx (Client Error):** 400 Bad Request, 401 Unauthorized (auth needed), 403 Forbidden (auth failed/insufficient perms), 404 Not Found.\n- **5xx (Server Error):** 500 Internal Server Error (often leaks stack traces), 502 Bad Gateway, 503 Service Unavailable."
      },
      {
        "title": "DevTools Network Tab: The X-Ray Vision",
        "beginner": "Your browser's Developer Tools (F12) have a 'Network' tab that shows every single request your browser makes. You can see images loading, scripts running, and API calls happening in real-time. For hackers, this is gold. You can click on any request to see exactly what data was sent and what came back. You can even right-click a request and 'Copy as cURL' to replay it from your terminal.",
        "advanced": "**DevTools Workflow:**\n1. Open F12 → Network Tab.\n2. Filter by `XHR` or `Fetch` to see API calls.\n3. Click a request → View `Headers`, `Payload` (body), and `Response`.\n4. **Replay:** Right-click → 'Copy as cURL'. Paste into terminal to reproduce request outside browser.\n5. **Modify:** Use 'Edit and Resend' (Firefox) or Burp Suite to change parameters.\n\n**Hidden Endpoints:**\nOften, frontend JavaScript contains API endpoints not linked in the UI. Inspecting network traffic reveals these hidden paths (e.g., `/api/admin/users`). Analyzing response bodies can leak sensitive data if the backend doesn't properly filter fields."
      }
    ],
    "practical": {
      "title": "Intercepting & Analyzing HTTP Traffic",
      "intro": "We will use browser DevTools to inspect live HTTP traffic, identify hidden API endpoints, and analyze response headers for information leakage.",
      "steps": [
        "Open any web application in Chrome/Firefox. Press F12 to open DevTools. Go to the 'Network' tab.",
        "Perform an action (e.g., login, search). Observe the new requests appearing. Filter by 'XHR' to see API calls.",
        "Click on a POST request. Inspect the 'Payload' tab to see submitted data. Check the 'Headers' tab for `X-Powered-By` or `Server` headers that reveal technology stack.",
        "Right-click the request → 'Copy as cURL'. Paste into a terminal. Modify a parameter (e.g., change `id=1` to `id=2`) and resend to test for IDOR (Insecure Direct Object Reference)."
      ],
      "goal": "Master the ability to view, understand, and replay HTTP requests using native browser tools."
    },
    "quiz": [
      {
        "question": "Which HTTP method is typically used to submit sensitive data like passwords?",
        "options": [
          "GET",
          "POST",
          "PUT",
          "DELETE"
        ],
        "correctIndex": 1,
        "explanation": "POST sends data in the request body, which is not cached by browsers or logged in server access logs by default. GET appends data to the URL, making it visible in history, logs, and shoulder-surfing."
      },
      {
        "question": "What does a 500 Internal Server Error often indicate to an attacker?",
        "options": [
          "The page is missing",
          "The user is unauthorized",
          "A backend code or database error occurred",
          "The server is offline"
        ],
        "correctIndex": 2,
        "explanation": "500 errors indicate unhandled exceptions in server-side code. They often leak stack traces, database queries, or file paths, providing valuable reconnaissance data for further exploitation."
      },
      {
        "question": "Why is the 'X-Powered-By' header considered a security risk?",
        "options": [
          "It slows down the server",
          "It reveals the underlying technology stack",
          "It encrypts the connection",
          "It blocks hackers"
        ],
        "correctIndex": 1,
        "explanation": "Headers like `X-Powered-By: Express` or `Server: Apache/2.4.49` tell attackers exactly what software versions are running, allowing them to search for specific CVEs targeting those versions."
      }
    ],
    "keyTakeaways": [
      "HTTP Methods: GET (read), POST (submit), PUT (update), DELETE (remove).",
      "Status Codes: 200 (OK), 403 (Forbidden), 500 (Server Error/Info Leak).",
      "DevTools Network Tab allows inspection and replay of all browser traffic.",
      "Hidden API endpoints are often discovered via network traffic analysis."
    ]
  },
  {
    "id": "cyber-13",
    "module": "Module 2: How the Web & Attacks Work",
    "order": 5,
    "title": "Authentication, Cookies & Session Hijacking",
    "icon": "🍪",
    "terminalNotice": "Session tokens are sensitive. Do not share your cookies. HttpOnly flags prevent JavaScript access.",
    "philosophy": "HTTP is stateless. Cookies are the memory. Steal the cookie, steal the identity.",
    "concepts": [
      {
        "title": "Stateless HTTP & Session Management",
        "beginner": "HTTP doesn't remember you. Every time you click a link, it’s like meeting the server for the first time. To fix this, servers give you a 'Session ID' stored in a cookie. Your browser sends this cookie with every request. The server looks up the ID to remember who you are. If someone steals your cookie, they become you.",
        "advanced": "HTTP is stateless. Session management maintains state across requests.\n**Mechanism:**\n1. User authenticates.\n2. Server generates unique Session ID (high entropy random string).\n3. Server stores Session ID ↔ User Data mapping (in memory/DB).\n4. Server sends Session ID to client via `Set-Cookie` header.\n5. Client includes Cookie in subsequent requests.\n\n**Vulnerability:** Session Fixation (attacker sets known session ID), Session Prediction (weak randomness), and Session Sniffing (unencrypted transmission)."
      },
      {
        "title": "JWT Anatomy & Risks",
        "beginner": "JSON Web Tokens (JWT) are like digital passports. They contain three parts: Header (what type it is), Payload (who you are), and Signature (proof it’s real). The problem? The Payload is just Base64 encoded, not encrypted. Anyone can read it. And if the signature check is weak or skipped, hackers can forge their own passports to become admins.",
        "advanced": "JWT Structure: `Header.Payload.Signature`\n- **Header:** `{\"alg\": \"HS256\", \"typ\": \"JWT\"}`\n- **Payload:** `{\"sub\": \"123\", \"role\": \"admin\"}` (Base64Url encoded, NOT encrypted).\n- **Signature:** HMACSHA256(base64UrlEncode(header) + '.' + base64UrlEncode(payload), secret)\n\n**Attacks:**\n- **None Algorithm:** Change header alg to 'none' and remove signature. Some libraries accept unsigned tokens.\n- **Weak Secret:** Brute-force HS256 secret if short.\n- **RS256 to HS256 Confusion:** If server expects RSA public key but attacker switches to HMAC with public key as secret.\n- **Data Leakage:** Sensitive data in payload is visible to anyone."
      },
      {
        "title": "Cookie Flags & Session Hijacking",
        "beginner": "Cookies have flags that tell the browser how to handle them. 'HttpOnly' means JavaScript can’t touch the cookie (stops XSS theft). 'Secure' means it only travels over HTTPS. 'SameSite' prevents other websites from sending the cookie. If these are missing, hackers can steal cookies via XSS or trick your browser into sending them to malicious sites.",
        "advanced": "**Cookie Attributes:**\n- `HttpOnly`: Prevents client-side script access (mitigates XSS cookie theft).\n- `Secure`: Ensures cookie only sent over HTTPS.\n- `SameSite=Strict/Lax`: Prevents CSRF by restricting cross-origin sending.\n- `Domain/Path`: Scope of cookie.\n\n**Session Hijacking Techniques:**\n- **Sniffing:** Capture unencrypted cookies on public WiFi.\n- **XSS:** `document.cookie` exfiltration if HttpOnly is missing.\n- **CSRF:** Force victim’s browser to send cookie to attacker-controlled site.\n- **Session Fixation:** Attacker provides a valid session ID before login."
      }
    ],
    "practical": {
      "title": "Analyzing Cookies & JWTs",
      "intro": "Inspect session cookies and JWTs to identify missing security flags and decode payload data.",
      "steps": [
        "Log in to a target app. Open DevTools → Application → Cookies.",
        "Check for `HttpOnly`, `Secure`, and `SameSite` flags. Note missing flags.",
        "If JWT is used, copy the token. Decode the Payload section at jwt.io.",
        "Check for sensitive data in Payload (e.g., internal IDs, roles). Attempt to modify 'role' to 'admin' and resign if possible (for educational purposes only)."
      ],
      "goal": "Identify insecure cookie configurations and understand JWT structure and risks."
    },
    "quiz": [
      {
        "question": "What does the HttpOnly cookie flag prevent?",
        "options": [
          "Cookie theft via network sniffing",
          "JavaScript access to the cookie (XSS)",
          "Cookie expiration",
          "Cross-Site Request Forgery"
        ],
        "correctIndex": 1,
        "explanation": "HttpOnly prevents client-side scripts (JavaScript) from accessing the cookie via `document.cookie`, mitigating cookie theft via Cross-Site Scripting (XSS)."
      },
      {
        "question": "Is the payload of a JWT encrypted?",
        "options": [
          "Yes, always",
          "No, it is only Base64 encoded",
          "Only if RS256 is used",
          "Only if HS256 is used"
        ],
        "correctIndex": 1,
        "explanation": "JWT payloads are Base64Url encoded, not encrypted. Anyone can decode and read the contents. Sensitive data should never be stored in JWT claims unless JWE (JSON Web Encryption) is used."
      },
      {
        "question": "What is Session Fixation?",
        "options": [
          "Stealing a session cookie",
          "Forcing a user to use a known session ID",
          "Guessing a session ID",
          "Encrypting the session"
        ],
        "correctIndex": 1,
        "explanation": "Session Fixation occurs when an attacker sets a victim’s session ID to a known value before authentication. After the victim logs in, the attacker uses the known ID to hijack the authenticated session."
      }
    ],
    "keyTakeaways": [
      "HTTP is stateless; cookies maintain session state.",
      "JWT payloads are readable (Base64); never store secrets there.",
      "HttpOnly prevents XSS cookie theft; Secure enforces HTTPS.",
      "Session Hijacking steals identity; protect sessions with strong flags."
    ]
  },
  {
    "id": "cyber-14",
    "module": "Module 2: How the Web & Attacks Work",
    "order": 6,
    "title": "SQL Injection (SQLi) & Database Defense",
    "icon": "💉",
    "terminalNotice": "SQLi is critical. Never test on production databases. Use parameterized queries.",
    "philosophy": "Never trust user input. Code and data must be separated.",
    "concepts": [
      {
        "title": "What is SQL Injection?",
        "beginner": "SQL Injection happens when a website puts your input directly into a database command. Imagine a login form that builds a command like: `SELECT * FROM users WHERE name = '` + YOUR_INPUT + `'`. If you type `' OR '1'='1`, the command becomes `SELECT * FROM users WHERE name = '' OR '1'='1'`. Since '1'='1' is always true, the database returns all users. You’ve just logged in as the first user (often admin) without a password.",
        "advanced": "SQLi occurs when untrusted input is concatenated into SQL queries. \n**Types:**\n- **In-Band:** Error-based (leaks DB info) or Union-based (extracts data via UNION SELECT).\n- **Blind:** Boolean-based (true/false responses) or Time-based (delays indicate truth).\n- **Out-of-Band:** Uses DNS/HTTP requests to exfiltrate data (rare).\n\n**Impact:** Authentication bypass, data extraction, modification, deletion, and remote code execution (via `xp_cmdshell` in MSSQL or `LOAD_FILE` in MySQL)."
      },
      {
        "title": "Union-Based & Blind SQLi",
        "beginner": "Union-based SQLi lets you combine results from two tables. If you know the number of columns, you can ask the database to show you data from other tables (like passwords) alongside the normal results. Blind SQLi is harder: the page doesn’t show data, but you can ask true/false questions. 'Does the password start with A?' If the page loads normally, yes. If it errors, no. You repeat this for every letter.",
        "advanced": "**Union-Based:**\nRequires knowing column count (`ORDER BY 1,2,3...`).\nPayload: `' UNION SELECT username, password FROM users --`\nExtracts data directly into the response.\n\n**Blind Boolean:**\nPayload: `' AND (SELECT SUBSTRING(password,1,1) FROM users LIMIT 1) = 'a' --`\nIf true, page loads normally. If false, content changes/errors.\n\n**Blind Time-Based:**\nPayload: `' AND IF(1=1, SLEEP(5), 0) --`\nIf true, server delays 5 seconds. Used when no visual feedback exists."
      },
      {
        "title": "Defense: Parameterized Queries",
        "beginner": "The only way to stop SQLi is to separate code from data. Parameterized queries (Prepared Statements) treat user input as data, not code. The database compiles the command first, then plugs in the data. Even if you type `' OR '1'='1`, the database treats it as a literal string name, not a command. It’s like putting input in a sealed box that can’t escape.",
        "advanced": "**Parameterized Queries (Prepared Statements):**\nUse placeholders (`?` or `:name`) instead of concatenation.\nExample (Java JDBC):\n`PreparedStatement stmt = conn.prepareStatement('SELECT * FROM users WHERE name = ?');`\n`stmt.setString(1, userInput);`\n\nThe driver sends the query structure and data separately. The database engine treats data strictly as values, preventing injection.\n\n**Other Defenses:**\n- Input Validation (whitelist allowed chars).\n- Least Privilege (DB user has minimal permissions).\n- WAF (Web Application Firewall) rules for SQL patterns.\n- ORM (Object-Relational Mapping) frameworks often use prepared statements internally."
      }
    ],
    "practical": {
      "title": "Exploiting & Fixing SQL Injection",
      "intro": "Identify a SQLi vulnerability, extract data using Union-based technique, and understand how parameterized queries prevent it.",
      "steps": [
        "Find a vulnerable parameter (e.g., `?id=1`). Test with `'` to trigger error.\n",
        "Determine column count: `ORDER BY 1`, `ORDER BY 2`... until error.\n",
        "Extract data: `UNION SELECT 1, table_name FROM information_schema.tables --`.\n",
        "Review code: Compare vulnerable string concatenation vs secure parameterized query examples."
      ],
      "goal": "Demonstrate SQLi impact and understand the mechanics of parameterized defense."
    },
    "quiz": [
      {
        "question": "What is the primary cause of SQL Injection?",
        "options": [
          "Weak passwords",
          "Concatenating user input into SQL queries",
          "Unencrypted databases",
          "Old servers"
        ],
        "correctIndex": 1,
        "explanation": "SQLi occurs when user input is directly concatenated into SQL strings, allowing attackers to alter the query logic. Parameterized queries prevent this by treating input as data."
      },
      {
        "question": "Which SQLi technique is used when no data is displayed on the page?",
        "options": [
          "Union-based",
          "Error-based",
          "Blind SQLi",
          "Out-of-band"
        ],
        "correctIndex": 2,
        "explanation": "Blind SQLi is used when the application does not return data or errors. Attackers infer data through boolean responses (true/false) or time delays."
      },
      {
        "question": "How do parameterized queries prevent SQLi?",
        "options": [
          "They encrypt the input",
          "They separate code structure from data values",
          "They block special characters",
          "They use firewalls"
        ],
        "correctIndex": 1,
        "explanation": "Parameterized queries send the SQL structure and data separately to the database engine. The engine compiles the structure first, ensuring data is treated strictly as values, not executable code."
      }
    ],
    "keyTakeaways": [
      "SQLi allows attackers to manipulate database queries.",
      "Union-based extracts data; Blind infers data via true/false/time.",
      "Parameterized queries are the definitive defense against SQLi.",
      "Never concatenate user input into SQL strings."
    ]
  },
  {
    "id": "cyber-15",
    "module": "Module 2: How the Web & Attacks Work",
    "order": 7,
    "title": "Cross-Site Scripting (XSS) & Defenses",
    "icon": "⚡",
    "terminalNotice": "XSS payloads execute in the victim's browser. Do not test on unrelated sites.",
    "philosophy": "If you can run JavaScript on someone else’s browser, you own their session.",
    "concepts": [
      {
        "title": "The 3 Types of XSS",
        "beginner": "XSS lets hackers inject malicious JavaScript into websites viewed by others. Stored XSS saves the script in the database (like a comment forum). Every time someone views the comment, the script runs. Reflected XSS bounces the script off the server in a link (like a phishing URL). DOM-based XSS changes the page structure using JavaScript without sending data to the server. All three steal cookies or redirect users.",
        "advanced": "**Stored (Persistent):**\nPayload stored in DB (comments, profiles). Executed when victims view the page. High impact.\n\n**Reflected:**\nPayload in URL parameter. Server reflects it in response (e.g., search results). Requires victim to click malicious link. Non-persistent.\n\n**DOM-based:**\nClient-side vulnerability. JavaScript reads URL/hash and writes to DOM unsafely (e.g., `element.innerHTML = location.hash`). No server interaction required for execution."
      },
      {
        "title": "Payloads & Impact",
        "beginner": "A basic XSS payload is `<script>alert('XSS')</script>`. But hackers use more subtle ones like `<img src=x onerror=alert(1)>` to bypass filters. The goal isn’t just alerts; it’s to steal cookies (`document.cookie`), log keystrokes, or redirect users to fake login pages. If the site has admin panels, XSS can escalate privileges.",
        "advanced": "**Common Payloads:**\n- `<script>alert(1)</script>`\n- `<img src=x onerror=alert(1)>`\n- `<svg onload=alert(1)>`\n- `javascript:alert(1)` (in href)\n\n**Impact:**\n- **Session Hijacking:** Exfiltrate `document.cookie` to attacker server.\n- **Keylogging:** Attach event listeners to capture input.\n- **Phishing:** Overlay fake login forms.\n- **Defacement:** Modify DOM content.\n- **Worming:** Self-propagating XSS via social features."
      },
      {
        "title": "Defenses: Escaping & CSP",
        "beginner": "To stop XSS, never trust input. Escape special characters like `<` and `>` so they display as text, not code. Use Content Security Policy (CSP) to tell the browser which scripts are allowed to run. If CSP is set correctly, even if a hacker injects a script, the browser won’t execute it.",
        "advanced": "**Output Encoding:**\nConvert special chars to HTML entities: `<` → `&lt;`, `>` → `&gt;`. Context-aware encoding (HTML, JS, CSS, URL) is critical.\n\n**Content Security Policy (CSP):**\nHTTP header that whitelists trusted sources.\n`Content-Security-Policy: default-src 'self'; script-src 'self' https://trusted.cdn.com`\nPrevents inline scripts and external scripts from untrusted domains.\n\n**HttpOnly Cookies:**\nPrevents JavaScript access to session cookies, mitigating session theft via XSS."
      }
    ],
    "practical": {
      "title": "Executing & Preventing XSS",
      "intro": "Inject a reflected XSS payload, observe the execution, and implement CSP to block it.",
      "steps": [
        "Find a reflected parameter (e.g., search box). Input `<script>alert('XSS')</script>`.\n",
        "Observe the alert. View page source to see how input is reflected.\n",
        "Try bypassing filters: `<img src=x onerror=alert(1)>`.\n",
        "Implement CSP header: `Content-Security-Policy: default-src 'none'`. Reload page. Observe script blocking in Console."
      ],
      "goal": "Understand XSS execution vectors and the effectiveness of CSP and encoding defenses."
    },
    "quiz": [
      {
        "question": "Which XSS type persists in the database?",
        "options": [
          "Reflected",
          "Stored",
          "DOM-based",
          "Blind"
        ],
        "correctIndex": 1,
        "explanation": "Stored XSS saves the malicious payload in the server’s database (e.g., comments). It executes every time a user views the affected page."
      },
      {
        "question": "What is the primary purpose of Content Security Policy (CSP)?",
        "options": [
          "Encrypt data",
          "Whitelist trusted script sources",
          "Block SQL injection",
          "Hide cookies"
        ],
        "correctIndex": 1,
        "explanation": "CSP restricts which sources (domains) can load resources like scripts. It prevents execution of inline scripts and scripts from untrusted domains, mitigating XSS."
      },
      {
        "question": "Why is output encoding important?",
        "options": [
          "It speeds up the site",
          "It converts special chars to harmless text",
          "It encrypts the database",
          "It compresses images"
        ],
        "correctIndex": 1,
        "explanation": "Output encoding converts characters like `<` and `>` into HTML entities (`&lt;`, `&gt;`), ensuring they are displayed as text rather than executed as code."
      }
    ],
    "keyTakeaways": [
      "XSS types: Stored (DB), Reflected (URL), DOM-based (Client-side).",
      "Impact: Session theft, keylogging, defacement.",
      "Defense: Output encoding, CSP, HttpOnly cookies.",
      "Never trust user input; treat it as data, not code."
    ]
  },
  {
    "id": "cyber-12",
    "module": "Module 2: How the Web & Attacks Work",
    "order": 8,
    "title": "Web Proxies & Burp Suite Fundamentals",
    "icon": "🕵️",
    "terminalNotice": "Burp Suite Community Edition is free. Configure browser proxy to 127.0.0.1:8080.",
    "philosophy": "The client is untrusted. Never trust input from the browser. A proxy proves that any request can be modified.",
    "concepts": [
      {
        "title": "Interception Proxies: Man-in-the-Middle",
        "beginner": "An interception proxy sits between your browser and the server. It catches every request, lets you pause it, change anything you want, and then send it on. It’s like a postal worker who opens your letter, changes the message, and reseals it before delivering it. This proves that client-side validation (like JavaScript checks) is useless because hackers can bypass it entirely.",
        "advanced": "Burp Suite acts as a local HTTP/S proxy (default 127.0.0.1:8080). \n**Workflow:**\n1. Browser sends request to Proxy.\n2. Proxy holds request in 'Intercept' mode.\n3. User modifies headers/body/parameters.\n4. Proxy forwards modified request to server.\n5. Server response returns to Proxy, then to Browser.\n\n**SSL Stripping/TLS Interception:**\nTo intercept HTTPS, Burp generates a dynamic CA certificate. This must be installed in the browser's trust store. Burp then terminates the TLS connection from the client, inspects plaintext HTTP, and establishes a new TLS connection to the server. This allows full visibility into encrypted traffic."
      },
      {
        "title": "Repeater & Intruder: Automation Tools",
        "beginner": "Burp has two main tools. Repeater lets you manually tweak and resend a single request over and over to see how the server reacts. Intruder automates attacks by taking one request and trying thousands of variations (like guessing passwords or finding hidden files). It’s like having a robot try every key on a keyring.",
        "advanced": "**Repeater:**\nManual testing tool. Ideal for crafting precise payloads for SQLi, XSS, or logic flaws. Allows viewing raw request/response side-by-side.\n\n**Intruder:**\nAutomated fuzzing tool. Modes:\n- **Sniper:** Tests one position at a time with a payload list.\n- **Battering Ram:** Tests multiple positions simultaneously with same payload.\n- **Pitchfork:** Tests multiple positions with correlated payload lists.\n- **Cluster Bomb:** Tests all combinations of multiple payload lists (combinatorial explosion).\n\n**Use Cases:**\n- Brute-force login (`password` parameter).\n- Directory busting (`/admin`, `/backup`).\n- Parameter fuzzing (testing for injection points)."
      },
      {
        "title": "Bypassing Client-Side Validation",
        "beginner": "Websites often use JavaScript to check if your password is long enough or if your email looks right. But this happens in your browser. A proxy lets you send a request that ignores these rules. You can send a 1-character password or a malformed email, and if the server accepts it, the website is vulnerable. Always assume the server does no checking of its own.",
        "advanced": "Client-side validation (HTML5 `required`, JS regex) is a UX feature, not a security control. \n**Attack Vector:**\n1. Identify form with JS validation.\n2. Intercept submission in Burp Proxy.\n3. Modify payload to violate validation rules (e.g., remove `@` from email, set password length to 1).\n4. Forward request.\n5. If server processes it, validation is purely client-side.\n\n**Defense:**\nServer-side validation is mandatory. Input must be sanitized, typed, and length-checked on the backend regardless of frontend constraints."
      }
    ],
    "practical": {
      "title": "Intercepting & Modifying Requests with Burp",
      "intro": "Configure Burp Suite to intercept traffic, modify a request to bypass client-side validation, and observe the server's response.",
      "steps": [
        "Start Burp Suite. Ensure Proxy → Intercept is 'On'. Configure browser proxy to 127.0.0.1:8080.",
        "Submit a form on a target site (e.g., login). Burp captures the request.",
        "Modify the request body: Change a parameter value (e.g., `price=100` to `price=1`).",
        "Forward the request. Observe the response. Did the server accept the modified value?",
        "Send the request to Repeater (Ctrl+R). Test different values manually to map server behavior."
      ],
      "goal": "Demonstrate the ability to intercept, modify, and replay HTTP requests to bypass client-side controls."
    },
    "quiz": [
      {
        "question": "Why is client-side validation insufficient for security?",
        "options": [
          "It is too slow",
          "It can be bypassed by modifying requests via a proxy",
          "It uses weak encryption",
          "It only works on Chrome"
        ],
        "correctIndex": 1,
        "explanation": "Client-side validation runs in the user's browser. An attacker using an interception proxy can modify requests after they leave the browser, completely bypassing any JavaScript or HTML5 checks. Server-side validation is required."
      },
      {
        "question": "Which Burp Suite tool is best for manual, iterative testing of a single request?",
        "options": [
          "Intruder",
          "Repeater",
          "Decoder",
          "Comparer"
        ],
        "correctIndex": 1,
        "explanation": "Repeater allows manual modification and resending of a single request, ideal for crafting precise payloads and observing subtle server responses. Intruder is for automated fuzzing."
      },
      {
        "question": "How does Burp Suite intercept HTTPS traffic?",
        "options": [
          "It breaks the encryption",
          "It uses a custom CA certificate to perform TLS interception",
          "It only works on HTTP",
          "It asks the server for the key"
        ],
        "correctIndex": 1,
        "explanation": "Burp acts as a MITM proxy. It presents its own CA certificate to the browser (which must be trusted) to decrypt traffic, inspects it, and then re-encrypts it to the server using the server's actual certificate."
      }
    ],
    "keyTakeaways": [
      "Interception proxies allow modification of any HTTP request/response.",
      "Client-side validation is bypassable; server-side validation is mandatory.",
      "Burp Repeater is for manual testing; Intruder is for automated fuzzing.",
      "HTTPS interception requires installing Burp's CA certificate in the browser."
    ]
  },
  {
    "id": "cyber-6",
    "module": "Module 3: Network Reconnaissance & Forensics",
    "order": 9,
    "title": "Computer Networking Essentials for Hackers",
    "icon": "🌐",
    "terminalNotice": "Network commands read system state. They do not change configurations unless you use 'sudo'.",
    "philosophy": "Every hack travels over a wire or airwaves. If you do not understand packets, IP headers, and ARP tables, you are attacking in the dark.",
    "concepts": [
      {
        "title": "IP Addressing & Subnetting: The Map of the Internet",
        "beginner": "Imagine the internet is a giant city. An IP address is your house number. But cities are too big to manage one by one, so we divide them into neighborhoods called 'Subnets.' CIDR notation (like /24) is just a way of saying how big the neighborhood is. A /24 neighborhood has 254 houses. A /16 neighborhood is a whole district with 65,000 houses. Private IPs (like 192.168.x.x) are like internal office extensions—they only work inside your building. To talk to the outside world, you need a Public IP, which acts like the building’s main reception desk that forwards calls to the right extension.",
        "advanced": "IPv4 is a 32-bit address space (4.3 billion unique addresses), rapidly exhausted, leading to NAT (Network Address Translation). IPv6 is 128-bit (3.4×10^38 addresses), solving exhaustion but introducing new attack surfaces like Neighbor Discovery Protocol (NDP) spoofing. \n\n**RFC 1918 Private Ranges:**\n- `10.0.0.0/8` (Class A): Large enterprises. 16 million hosts.\n- `172.16.0.0/12` (Class B): Medium networks. 1 million hosts.\n- `192.168.0.0/16` (Class C): Home/Small Office. 65k hosts.\n\n**CIDR Math:**\nThe slash notation `/24` means the first 24 bits are the Network ID, and the remaining 8 bits are Host IDs. \nFormula: `Usable Hosts = 2^(32 - prefix) - 2`. \nExample: `/24` → `2^8 - 2 = 254` usable IPs. \nSubnet masks are bitwise AND operations. `255.255.255.0` in binary is twenty-four 1s followed by eight 0s. Misconfigured subnets cause routing loops or expose internal segments to external sniffing if VLANs are not properly tagged (802.1Q)."
      },
      {
        "title": "MAC Addresses & ARP: The Local Trust Problem",
        "beginner": "If IP is your home address, MAC (Media Access Control) is your fingerprint. It’s burned into your network card at the factory and never changes. When you send data to someone in your local neighborhood (same subnet), you don’t use their IP; you use their MAC. But how do you find it? You shout, 'Who has IP 192.168.1.5?' This shout is called ARP (Address Resolution Protocol). The problem? Everyone trusts the shout. If I shout, 'I am 192.168.1.1 (the router),' your computer believes me and sends me all its internet traffic. This is ARP Spoofing, the basis of most local network hacks.",
        "advanced": "MAC addresses are 48-bit Layer 2 identifiers. The first 24 bits (OUI) identify the manufacturer (e.g., Apple, Cisco). ARP operates at Layer 2.5, bridging Layer 2 (MAC) and Layer 3 (IP). \n\n**ARP Mechanics:**\n1. Host A wants to send to IP B. Checks local ARP cache (`ip neigh`).\n2. If missing, broadcasts ARP Request: `Who has IP_B? Tell IP_A`.\n3. Host B replies unicast: `IP_B is at MAC_B`.\n4. Host A caches this mapping (TTL ~2-20 mins).\n\n**The Vulnerability:**\nARP is stateless and unauthenticated. There is no verification that the responder actually owns the IP. \n\n**ARP Spoofing/Poisoning:**\nAttacker sends gratuitous ARP replies: `IP_Gateway is at MAC_Attacker`. Victim updates cache. All traffic destined for the gateway now flows to the attacker. The attacker forwards it to the real gateway (Man-in-the-Middle) to avoid detection. \n\n**Defense:**\n- Static ARP entries (`arp -s IP MAC`).\n- Dynamic ARP Inspection (DAI) on managed switches.\n- ARPwatch daemons to alert on MAC changes."
      },
      {
        "title": "OSI Model: Where Attacks Live",
        "beginner": "The OSI model is a 7-layer cake that explains how data moves. Hackers don't care about the theory; they care about where the cracks are. \n- Layer 2 (Data Link): ARP poisoning, MAC flooding.\n- Layer 3 (Network): IP spoofing, Ping of Death.\n- Layer 4 (Transport): SYN floods, Port scanning.\n- Layer 7 (Application): SQL Injection, Phishing, HTTP exploits.\nIf you block Layer 3 attacks with a firewall, a hacker will just move up to Layer 7 and inject malicious code into a web form. You must defend every layer.",
        "advanced": "Attacks are categorized by the OSI layer they target:\n\n**Layer 2 (Data Link):**\n- **MAC Flooding:** Fills switch CAM table, forcing switch into 'hub mode' (broadcasts all traffic).\n- **VLAN Hopping:** Double-tagging 802.1Q frames to escape network segmentation.\n\n**Layer 3 (Network):**\n- **IP Spoofing:** Forging source IP in DDoS amplification.\n- **ICMP Redirect:** Tricking host to update routing table to send traffic via attacker.\n- **Fragmentation Attacks:** Teardrop attack exploits OS reassembly bugs.\n\n**Layer 4 (Transport):**\n- **SYN Flood:** Exhausts server backlog queue with half-open connections.\n- **TCP RST Injection:** Resets legitimate sessions by forging RST packets with correct sequence numbers.\n- **UDP Amplification:** Small query → Large response (DNS/NTP) directed at victim.\n\n**Layer 7 (Application):**\n- **HTTP Parameter Pollution:** Confuses WAFs by adding duplicate parameters.\n- **SQLi/XSS:** Injects code into application logic.\n- **Deserialization Attacks:** Exploits how apps reconstruct objects from data.\n\n**Defense Strategy:**\nLayered security (Defense in Depth). L2: 802.1X. L3: ACLs/IPSec. L4: Stateful Firewalls. L7: WAF/Input Validation."
      }
    ],
    "practical": {
      "title": "Network Interface & ARP Forensics",
      "intro": "We will inspect the raw network state. You will learn to read the ARP table to detect anomalies and identify your gateway—the most critical target in a local network.",
      "steps": [
        "Run `ip addr show`. Identify your interface (eth0/wlan0). Note the `inet` (IPv4) and `link/ether` (MAC). Check the scope: `global` means routable, `link` means local only.",
        "Run `ip neigh show` (or `arp -a`). This is your ARP cache. Look for the entry corresponding to your default gateway. Note the MAC address.",
        "Run `ip route show default`. This confirms the gateway IP. Compare this IP with the MAC in your ARP table. If you see two different MACs for the same Gateway IP, you are likely under an ARP spoofing attack.",
        "Analyze the TTL (Time To Live) of entries. Stale entries that don't refresh may indicate a disconnected host or a static ARP entry set by an admin."
      ],
      "goal": "Identify your network topology, map IP-to-MAC relationships, and recognize the signs of ARP poisoning."
    },
    "quiz": [
      {
        "question": "Why is a /24 subnet mask represented as 255.255.255.0?",
        "options": [
          "It's a random standard",
          "It represents 24 bits of '1's in binary, leaving 8 bits for hosts",
          "It allows for 256 networks",
          "It is the default for IPv6"
        ],
        "correctIndex": 1,
        "explanation": "CIDR /24 means the first 24 bits of the 32-bit IP are the network portion. In binary, 24 '1's followed by 8 '0's equals 11111111.11111111.11111111.00000000, which converts to 255.255.255.0 in decimal. This leaves 8 bits for host addresses (2^8 = 256 total, minus 2 for network/broadcast = 254 usable)."
      },
      {
        "question": "What is the fundamental flaw in the ARP protocol that allows spoofing?",
        "options": [
          "It uses weak encryption",
          "It is stateless and accepts replies without verifying ownership",
          "It only works on WiFi",
          "It requires a password"
        ],
        "correctIndex": 1,
        "explanation": "ARP was designed for trusted local networks. It has no authentication mechanism. If a device receives an ARP reply claiming 'IP X is at MAC Y,' it updates its cache immediately without checking if MAC Y actually owns IP X. This trust-based design is the root cause of MITM attacks on LANs."
      },
      {
        "question": "Which OSI layer does a SQL Injection attack target?",
        "options": [
          "Layer 2 (Data Link)",
          "Layer 3 (Network)",
          "Layer 4 (Transport)",
          "Layer 7 (Application)"
        ],
        "correctIndex": 3,
        "explanation": "SQL Injection targets the application layer (Layer 7) by injecting malicious SQL queries into input fields. It exploits the logic of the web application and database interaction, not the underlying network transport or routing protocols."
      }
    ],
    "keyTakeaways": [
      "Private IPs (RFC 1918) are non-routable; Public IPs are required for internet access.",
      "ARP is unauthenticated; always verify Gateway MAC consistency to detect spoofing.",
      "OSI Layers dictate defense: L2=Switch security, L3=Firewalls, L7=WAF/Input Validation.",
      "CIDR /24 = 254 usable hosts. /16 = 65,534 usable hosts.",
      "`ip neigh` and `ip route` are essential for local network reconnaissance."
    ]
  },
  {
    "id": "cyber-7",
    "module": "Module 3: Network Reconnaissance & Forensics",
    "order": 10,
    "title": "TCP/IP Handshake, Ports & Attack Vectors",
    "icon": "🔌",
    "terminalNotice": "Checking listening ports is passive. Do not attempt to connect to services you do not own.",
    "philosophy": "Open ports are the digital doors to a server. Knowing which doors are open and how the lock works is step one of penetration testing.",
    "concepts": [
      {
        "title": "TCP 3-Way Handshake vs UDP: Reliability vs Speed",
        "beginner": "TCP is like a registered letter. You send it, get a receipt, and confirm delivery. It starts with a handshake: SYN (Hello), SYN-ACK (Hello back), ACK (Great, let's talk). This ensures reliability. UDP is like a postcard. You throw it in the mail and hope it arrives. No receipt, no order guarantee. Hackers love TCP for control (stealth scans) and UDP for chaos (amplification attacks), because UDP doesn't check who sent the request, making it easy to fake the sender's address.",
        "advanced": "**TCP State Machine:**\n1. **SYN**: Client sends segment with SYN flag, Initial Sequence Number (ISN) = x.\n2. **SYN-ACK**: Server responds with SYN+ACK, ISN = y, Ack = x+1.\n3. **ACK**: Client sends Ack = y+1. Connection ESTABLISHED.\n\n**SYN Flood Attack:**\nAttacker sends massive SYN packets with spoofed IPs. Server allocates memory for each half-open connection (SYN_RECEIVED state). Queue fills up, legitimate users are denied service. \n*Mitigation:* SYN Cookies (stateless handshake verification), increasing backlog size, rate limiting.\n\n**UDP Characteristics:**\nConnectionless, stateless. No handshake. Used for DNS, VoIP, Streaming. \n**Amplification Attack:**\nAttacker spoofs victim's IP and sends small UDP requests (e.g., DNS ANY query) to open resolvers. Responder sends large reply to victim. Amplification factor can be 50x-70x. \n*Mitigation:* Disable open recursion, implement BCP38 (source IP validation)."
      },
      {
        "title": "Critical Ports: The High-Value Targets",
        "beginner": "Ports are numbered locks. Some are standard: 80 for Web, 443 for Secure Web, 22 for SSH. Others are dangerous relics: 23 (Telnet) sends passwords in plain text. 445 (SMB) is the door WannaCry ransomware used to spread. 3389 (RDP) is constantly brute-forced by bots. If you see port 21 (FTP) or 23 (Telnet) open to the internet, it’s a critical vulnerability. Modern systems should only have 22 (SSH), 80/443 (Web), and maybe 3306 (MySQL) bound to localhost.",
        "advanced": "**High-Risk Port Analysis:**\n- **21/TCP (FTP):** Plaintext credentials. Use SFTP (SSH) or FTPS (TLS). Anonymous login misconfigurations expose entire file systems.\n- **22/TCP (SSH):** Secure shell. Harden with Key-Based Auth, disable Root Login, change default port to evade bots. Watch for CVEs in OpenSSH versions.\n- **23/TCP (Telnet):** Obsolete. Plaintext everything. Immediate remediation required.\n- **80/TCP (HTTP):** Unencrypted. Susceptible to sniffing/MITM. Redirect to 443.\n- **443/TCP (HTTPS):** TLS encrypted. Check for weak ciphers (RC4, SSLv3) and expired certs. Heartbleed (CVE-2014-0160) affected OpenSSL.\n- **445/TCP (SMB):** File sharing. MS17-010 (EternalBlue) exploited SMBv1 buffer overflow. Disable SMBv1. Restrict to internal VLANs.\n- **3389/TCP (RDP):** Remote Desktop. Target of BlueKeep (CVE-2019-0708). Enforce NLA (Network Level Authentication) and MFA.\n- **53/UDP (DNS):** Open resolvers enable amplification. Restrict recursion to internal clients.\n- **161/UDP (SNMP):** Community strings 'public/private' allow full device config read/write. Use SNMPv3 with auth."
      },
      {
        "title": "TCP Flags & Stealth Scanning",
        "beginner": "TCP packets have flags like 'SYN' (start), 'FIN' (end), and 'RST' (reset). Normal traffic follows a pattern. Hackers break the pattern to sneak past firewalls. A 'SYN Scan' sends only the start signal. If the door opens (SYN-ACK), the hacker knows it's open but immediately hangs up (RST) so no full connection is logged. A 'NULL Scan' sends a packet with no flags at all. Many basic firewalls ignore it, but closed ports will still reply with 'RST', revealing they exist. It’s like knocking on a door silently to see if anyone answers.",
        "advanced": "**TCP Flag Manipulation:**\n- **SYN Scan (-sS):** Half-open scan. Sends SYN. If SYN-ACK → Open. Send RST to close. Stealthy, requires root.\n- **FIN Scan (-sF):** Sends FIN. Closed ports reply RST. Open/Filtered drop it. Evades stateless firewalls.\n- **NULL Scan (-sN):** No flags set. Same behavior as FIN. Detected by IDS as anomalous.\n- **XMAS Scan (-sX):** Sets FIN, PSH, URG flags. 'Lit up like a Christmas tree.' Same detection logic as FIN.\n- **ACK Scan (-sA):** Sends ACK. Used to map firewall rules. Filtered ports drop; unfiltered reply RST. Does not determine open/closed, only filtered/unfiltered.\n\n**Stateful Firewall Evasion:**\nModern firewalls track connection states. They expect SYN first. Unexpected FIN or NULL packets are flagged. However, poorly configured stateless firewalls only filter based on destination port/IP, ignoring flags, making these scans effective."
      }
    ],
    "practical": {
      "title": "Service Enumeration with ss",
      "intro": "We will use `ss` (socket statistics) to see what doors are open on your machine. This is the first step in hardening: know what is running before you secure it.",
      "steps": [
        "Run `ss -tulpn`. Flags: -t (TCP), -u (UDP), -l (listening), -p (process), -n (numeric).",
        "Identify services bound to `0.0.0.0` (all interfaces) vs `127.0.0.1` (localhost). Services on 0.0.0.0 are exposed to the network. Services on 127.0.0.1 are local-only.",
        "Check for high-risk ports: 21, 23, 445, 3389. If found, note the process name (e.g., vsftpd, telnetd).",
        "Verify service versions. For SSH, run `ssh -V`. For Apache, check config files. Outdated versions are primary exploitation vectors."
      ],
      "goal": "Map all listening services, identify exposure risks, and correlate ports to running processes."
    },
    "quiz": [
      {
        "question": "Why is UDP preferred for amplification attacks?",
        "options": [
          "It is encrypted",
          "It is connectionless and allows IP spoofing",
          "It is slower than TCP",
          "It requires a handshake"
        ],
        "correctIndex": 1,
        "explanation": "UDP is connectionless, meaning it does not verify the source IP. Attackers spoof the victim's IP and send small requests to servers that generate large responses (e.g., DNS). The server sends the large response to the victim, amplifying the traffic volume."
      },
      {
        "question": "Which port is associated with the EternalBlue vulnerability?",
        "options": [
          "22 (SSH)",
          "80 (HTTP)",
          "445 (SMB)",
          "3389 (RDP)"
        ],
        "correctIndex": 2,
        "explanation": "EternalBlue (MS17-010) exploited a buffer overflow in SMBv1 on port 445. It allowed remote code execution and worm-like propagation, used by WannaCry ransomware."
      },
      {
        "question": "What is the primary advantage of a SYN scan over a TCP Connect scan?",
        "options": [
          "It is faster and stealthier",
          "It works without root privileges",
          "It encrypts the scan",
          "It scans UDP ports"
        ],
        "correctIndex": 0,
        "explanation": "SYN scan sends only the initial SYN packet and resets the connection upon receiving SYN-ACK, avoiding the full handshake. This is faster and often evades application-level logs that only record established connections. It requires root privileges to craft raw packets."
      }
    ],
    "keyTakeaways": [
      "TCP is reliable (handshake); UDP is fast (connectionless).",
      "Ports 21, 23, 445, 3389 are high-risk; minimize exposure.",
      "SYN scan is stealthy; FIN/NULL/XMAS scans evade stateless firewalls.",
      "Use `ss -tulpn` to audit listening services.",
      "Amplification attacks exploit UDP spoofing and response size disparity."
    ]
  },
  {
    "id": "cyber-8",
    "module": "Module 3: Network Reconnaissance & Forensics",
    "order": 11,
    "title": "DNS Infrastructure & Target Reconnaissance",
    "icon": "🗺️",
    "terminalNotice": "DNS queries are public. Zone transfers should only be attempted on authorized targets.",
    "philosophy": "DNS is the phonebook of the internet. If you can read the whole phonebook, you find forgotten test servers and staging databases.",
    "concepts": [
      {
        "title": "DNS Resolution: The Hierarchical Lookup",
        "beginner": "When you type google.com, your computer doesn't know where it is. It asks a Recursive Resolver (like 8.8.8.8). The resolver asks the Root Server ('.'), which points to the .com Server. The .com Server points to Google's Authoritative Server. Google's Server says 'It's 142.250.80.46.' Your computer caches this. Different records tell different stories: A records are IPs, MX records are for email, TXT records are for notes (like security policies).",
        "advanced": "**DNS Hierarchy:**\n1. **Recursive Resolver:** Client-side agent (ISP/Public). Performs iterative queries.\n2. **Root Servers (13 clusters):** Refer to TLDs. Query `dig . NS`.\n3. **TLD Servers (.com, .org):** Managed by registries. Refer to Authoritative NS.\n4. **Authoritative NS:** Holds actual zone data.\n\n**Record Types:**\n- **A (IPv4), AAAA (IPv6):** Address mapping.\n- **CNAME:** Alias. Cannot coexist with other records.\n- **MX:** Mail Exchanger. Priority-based.\n- **TXT:** Arbitrary text. SPF (`v=spf1...`), DKIM, DMARC.\n- **NS:** Nameserver delegation.\n- **SOA:** Start of Authority. Serial number, refresh intervals.\n\n**DNSSEC:** Adds digital signatures (RRSIG) to prevent spoofing but does not encrypt queries (use DoH/DoT for privacy)."
      },
      {
        "title": "Active DNS Reconnaissance",
        "beginner": "Hackers use DNS to map a company. They look for subdomains like dev.company.com or staging.company.com. They check TXT records for SPF policies, which often list internal IP ranges (e.g., 'ip4:10.0.0.0/8'). This leaks the internal network structure. Tools like `dig` and `nslookup` are used to query these records. It’s like reading the footnotes in a document to find hidden clues.",
        "advanced": "**Recon Techniques:**\n- **Subdomain Enumeration:** Brute-force (`gobuster dns`), Certificate Transparency logs (`crt.sh`), Search Engines (`site:*.example.com`).\n- **SPF Analysis:** `dig example.com TXT`. Look for `ip4:` ranges. Reveals internal infrastructure and third-party services.\n- **Reverse DNS:** `dig -x IP`. Maps IPs to hostnames.\n- **Zone Walking:** If DNSSEC NSEC records are used, iterate through linked list to enumerate all names. NSEC3 mitigates with hashing but is vulnerable to offline dictionary attacks."
      },
      {
        "title": "DNS Attack Vectors",
        "beginner": "DNS attacks are clever. Cache Poisoning tricks your computer into remembering the wrong IP for a site. DNS Tunneling hides stolen data inside DNS queries, slipping past firewalls because DNS is usually allowed. Zone Transfer is the jackpot: if a server is misconfigured, you can download the entire DNS database—all subdomains and internal IPs—in one go.",
        "advanced": "**Attack Vectors:**\n- **Cache Poisoning (Kaminsky):** Floods resolver with forged responses matching transaction IDs. Mitigation: Source port randomization, DNSSEC.\n- **DNS Tunneling:** Encodes data in subdomain labels (e.g., `data.evil.com`). Bypasses firewalls. Detection: Long subdomains, high query frequency.\n- **Zone Transfer (AXFR):** `dig axfr @ns1.example.com example.com`. Downloads entire zone. Fix: Restrict AXFR to trusted secondary IPs in BIND config (`allow-transfer { ip; };`).\n- **Fast Flux:** Rapidly rotating IPs behind a domain to evade takedowns. Used by botnets."
      }
    ],
    "practical": {
      "title": "DNS Interrogation & Zone Transfer",
      "intro": "We will use `dig` to extract intelligence from DNS records and attempt a zone transfer to demonstrate the risk of misconfiguration.",
      "steps": [
        "Run `dig target.thm ANY +noall +answer`. View all record types.\n",
        "Query TXT records: `dig target.thm TXT`. Analyze SPF for internal IP ranges.\n",
        "Attempt Zone Transfer: `dig axfr @ns1.target.thm target.thm`. If successful, review the full zone file for hidden subdomains.\n",
        "Document findings: List subdomains, internal IPs, and mail servers."
      ],
      "goal": "Extract maximum intelligence from DNS records and identify zone transfer vulnerabilities."
    },
    "quiz": [
      {
        "question": "What information does an SPF TXT record reveal?",
        "options": [
          "Website content",
          "Authorized mail servers and internal IP ranges",
          "SSL certificate details",
          "Server OS version"
        ],
        "correctIndex": 1,
        "explanation": "SPF records list IPs authorized to send email. They often include internal IP ranges (e.g., `ip4:10.0.0.0/8`), leaking network topology."
      },
      {
        "question": "Why is an unrestricted Zone Transfer (AXFR) dangerous?",
        "options": [
          "It slows down the server",
          "It exposes all subdomains and internal records",
          "It encrypts traffic",
          "It prevents phishing"
        ],
        "correctIndex": 1,
        "explanation": "AXFR downloads the entire DNS zone, revealing all subdomains, internal hosts, and service endpoints, eliminating the need for brute-force enumeration."
      },
      {
        "question": "How does DNS Tunneling bypass firewalls?",
        "options": [
          "It uses VPNs",
          "It hides data in DNS queries, which are typically allowed",
          "It breaks the firewall",
          "It uses HTTPS"
        ],
        "correctIndex": 1,
        "explanation": "DNS tunneling encodes data in DNS queries/responses. Since firewalls must allow DNS for normal operation, this traffic passes through undetected unless deep packet inspection is used."
      }
    ],
    "keyTakeaways": [
      "DNS hierarchy: Root → TLD → Authoritative.",
      "SPF records leak internal IP ranges.",
      "AXFR zone transfers expose entire network topology.",
      "DNS tunneling hides data exfiltration in DNS traffic.",
      "Use `dig` for comprehensive DNS reconnaissance."
    ]
  },
  {
    "id": "cyber-9",
    "module": "Module 3: Network Reconnaissance & Forensics",
    "order": 12,
    "title": "Port Scanning & Service Discovery with Nmap",
    "icon": "🎯",
    "terminalNotice": "Scanning external targets without permission is illegal. Use only on authorized labs.",
    "philosophy": "Nmap is the compass and radar of cybersecurity. A skilled scanner finds the needle-in-a-haystack vulnerability in seconds.",
    "concepts": [
      {
        "title": "Port Scanning Mechanics",
        "beginner": "Scanning is checking which doors are open. Nmap sends probes and listens for replies. Open ports reply positively. Closed ports say 'go away.' Filtered ports say nothing (firewall dropped it). ICMP discovery checks if the host is alive before scanning ports. It’s like knocking on the front door before trying every window.",
        "advanced": "**Port States:**\n- **Open:** Service accepts connections. TCP: SYN → SYN-ACK.\n- **Closed:** No service. TCP: SYN → RST.\n- **Filtered:** Firewall drops. No response or ICMP error.\n- **Open|Filtered:** Ambiguous (UDP/FIN/NULL scans).\n\n**ICMP Discovery (-sn):**\nSends ICMP Echo, TCP SYN to 443, TCP ACK to 80, ICMP Timestamp. Host is 'up' if any probe succeeds. Bypasses ICMP-blocking firewalls.\n\n**Timing Templates (-T0 to -T5):**\nAdjust speed/stealth. T0 (Paranoid) to T5 (Insane). T3 is default."
      },
      {
        "title": "SYN Stealth vs TCP Connect",
        "beginner": "SYN Scan (-sS) is stealthy. It sends a 'hello' and hangs up before the connection is fully made. It’s faster and leaves fewer logs. TCP Connect (-sT) completes the full handshake. It’s slower and noisier but works without special permissions. SYN scan needs root because it crafts raw packets.",
        "advanced": "**SYN Scan (-sS):**\nRequires root. Crafts raw SYN packets. If SYN-ACK received, sends RST to abort. Avoids full connection logs. Faster.\n\n**TCP Connect (-sT):**\nUses OS `connect()` syscall. No root needed. Completes full handshake. Slower, creates full logs.\n\n**Choice:**\nUse -sS for speed/stealth if root is available. Use -sT if unprivileged or facing strict IDS that flags raw packets."
      },
      {
        "title": "Version Detection & NSE Scripts",
        "beginner": "Once a port is open, Nmap can ask 'What software are you running?' (-sV). It reads banners and matches them to a database. Then, NSE scripts (-sC) can check for specific vulnerabilities like Heartbleed or default passwords. It’s like having a robot check every door for specific locks.",
        "advanced": "**Version Detection (-sV):**\nConnects to open ports, analyzes banners/responses against `nmap-service-probes` database. Identifies software/version (e.g., Apache 2.4.49). Enables CVE correlation.\n\n**NSE Scripts:**\n- **default (-sC):** Safe, fast info gathering.\n- **vuln:** Checks for known vulnerabilities (Heartbleed, EternalBlue).\n- **auth:** Tests default credentials.\n- **brute:** Password attacks (noisy).\n\n**Usage:**\n`nmap -sS -sV --script vuln -p- target` for comprehensive vulnerability assessment."
      }
    ],
    "practical": {
      "title": "Advanced Nmap Scanning",
      "intro": "Construct targeted scans to discover services and vulnerabilities efficiently.",
      "steps": [
        "Basic SYN/Version scan: `nmap -sS -sV -p 1-1000 target`.\n",
        "Full port scan: `nmap -sS -sV -p- -T4 target`. Scans all 65,535 ports.\n",
        "Vulnerability scan: `nmap -sS -sC --script vuln -p 22,80,443 target`.\n",
        "Analyze output: Identify versions, match to CVEs, prioritize targets."
      ],
      "goal": "Master Nmap syntax for efficient service discovery and vulnerability identification."
    },
    "quiz": [
      {
        "question": "Why does SYN scan require root privileges?",
        "options": [
          "To access password files",
          "To craft raw packets bypassing OS TCP stack",
          "To modify firewall rules",
          "To decrypt SSL"
        ],
        "correctIndex": 1,
        "explanation": "SYN scan uses raw sockets to craft custom packets, bypassing the OS TCP stack. Raw socket creation requires elevated privileges."
      },
      {
        "question": "What does `-p-` do in Nmap?",
        "options": [
          "Scans privileged ports",
          "Scans all 65,535 ports",
          "Skips port scanning",
          "Enables packet capture"
        ],
        "correctIndex": 1,
        "explanation": "`-p-` scans all TCP ports (1-65535), ensuring no service on non-standard ports is missed."
      },
      {
        "question": "Which NSE category checks for known vulnerabilities?",
        "options": [
          "default",
          "discovery",
          "vuln",
          "brute"
        ],
        "correctIndex": 2,
        "explanation": "The `vuln` category contains scripts for detecting known vulnerabilities like Heartbleed and EternalBlue."
      }
    ],
    "keyTakeaways": [
      "Port states: Open, Closed, Filtered.",
      "SYN scan (-sS) is stealthy/fast; Connect scan (-sT) is unprivileged.",
      "Version detection (-sV) enables CVE correlation.",
      "NSE scripts automate vulnerability checking.",
      "Full port scan: `nmap -sS -sV -p- target`."
    ]
  },
  {
    "id": "cyber-10",
    "module": "Module 3: Network Reconnaissance & Forensics",
    "order": 13,
    "title": "Packet Analysis & Wireshark Fundamentals",
    "icon": "🦈",
    "terminalNotice": "Capture only on networks you own. Promiscuous mode captures all traffic.",
    "philosophy": "The wire never lies. When an intrusion happens, packet captures (PCAP) contain the unalterable truth of who attacked and how.",
    "concepts": [
      {
        "title": "Packet Sniffing & Promiscuous Mode",
        "beginner": "Normally, your network card ignores traffic not meant for it. Promiscuous mode makes it listen to everything. It’s like turning on a microphone in a crowded room to hear every conversation. This is essential for analysis. On switched networks, you only see your traffic unless you use port mirroring or ARP spoofing.",
        "advanced": "**Promiscuous Mode:**\nNIC passes all frames to OS. Enabled by Wireshark/tcpdump. \n**Capture Methods:**\n- **Direct Interface:** Local traffic only.\n- **Port Mirroring (SPAN):** Switch copies traffic to monitoring port.\n- **Network Tap:** Hardware inline copy.\n- **ARP Spoofing:** MITM redirection (illegal without auth).\n\n**Filters:**\n- **Capture Filter (BPF):** Applied during capture (e.g., `tcp port 80`). Reduces file size.\n- **Display Filter:** Applied post-capture (e.g., `http.request.method == \"POST\"`). More flexible."
      },
      {
        "title": "Wireshark Display Filters",
        "beginner": "Wireshark shows thousands of packets. Filters help you find the needle. `http` shows web traffic. `ip.addr == 1.2.3.4` shows traffic for a specific IP. `http.request.method == \"POST\"` shows login attempts. Combine them with `&&` (AND) and `||` (OR).",
        "advanced": "**Key Filters:**\n- `http.request.method == \"POST\"`: Login forms.\n- `ip.addr == 192.168.1.100`: Specific host.\n- `tcp.port == 21`: FTP.\n- `dns`: DNS queries.\n- `tcp.flags.syn == 1 && tcp.flags.ack == 0`: SYN scans.\n- `frame.len > 1000`: Large packets (exfiltration).\n- `http contains \"password\"`: Cleartext creds.\n\n**Strategy:** Start broad, narrow by method, add content match, exclude noise."
      },
      {
        "title": "Plaintext vs TLS/HTTPS",
        "beginner": "HTTP, FTP, and Telnet send data in plain text. Anyone sniffing can read passwords. HTTPS encrypts data. TLS 1.3 is the latest, most secure version. Always use HTTPS. If you see HTTP login traffic in a capture, you’ve found a critical vulnerability.",
        "advanced": "**Plaintext Risks:**\n- **HTTP:** URLs, cookies, POST data visible.\n- **FTP:** USER/PASS commands visible.\n- **Telnet:** All keystrokes visible.\n\n**TLS 1.3 Improvements:**\n- Encrypts handshake (hides server identity).\n- Removes weak ciphers (RC4, SHA-1).\n- Mandates Perfect Forward Secrecy (PFS).\n- 1-RTT handshake (faster).\n\n**Detection:**\nFilter `http.request.method == \"POST\" && http contains \"password\"`. Follow TCP Stream to reconstruct session."
      }
    ],
    "practical": {
      "title": "Credential Extraction from PCAP",
      "intro": "Analyze a capture file to extract plaintext credentials from HTTP traffic.",
      "steps": [
        "Load capture.pcap in Wireshark.\n",
        "Filter: `http.request.method == \"POST\"`.\n",
        "Inspect POST data for 'username' and 'password' fields.\n",
        "Follow TCP Stream to view full session context."
      ],
      "goal": "Demonstrate the danger of plaintext protocols by extracting credentials."
    },
    "quiz": [
      {
        "question": "What does promiscuous mode allow?",
        "options": [
          "Faster speeds",
          "Capturing all network traffic",
          "Blocking attacks",
          "Encrypting traffic"
        ],
        "correctIndex": 1,
        "explanation": "Promiscuous mode allows the NIC to capture all frames on the network segment, not just those addressed to its MAC."
      },
      {
        "question": "Which filter shows HTTP POST requests with 'password'?",
        "options": [
          "http.post && password",
          "http.request.method == \"POST\" && http contains \"password\"",
          "tcp.port == 80 && password",
          "http.method = POST"
        ],
        "correctIndex": 1,
        "explanation": "This filter combines method isolation and content search to identify credential submissions."
      },
      {
        "question": "Why is TLS 1.3 more secure than 1.2?",
        "options": [
          "Shorter keys",
          "Encrypts handshake and removes weak ciphers",
          "No certificates",
          "Localhost only"
        ],
        "correctIndex": 1,
        "explanation": "TLS 1.3 encrypts more of the handshake, mandates PFS, and removes insecure algorithms, improving both security and performance."
      }
    ],
    "keyTakeaways": [
      "Promiscuous mode captures all traffic.",
      "Wireshark filters are essential for analysis.",
      "Plaintext protocols (HTTP/FTP/Telnet) expose credentials.",
      "TLS 1.3 is the current standard for encrypted web traffic.",
      "Follow TCP Stream to reconstruct sessions."
    ]
  },
  {
    "id": "cyber-17",
    "module": "Module 4: Cryptography, Firewalls & Operations",
    "order": 14,
    "title": "Asymmetric Cryptography & SSL/TLS Handshake",
    "icon": "📜",
    "terminalNotice": "TLS protects data in transit. Certificates verify identity.",
    "philosophy": "Trust is established through chains of authority, not magic.",
    "concepts": [
      {
        "title": "Public Key Infrastructure (PKI)",
        "beginner": "Asymmetric cryptography uses two keys: Public (everyone sees) and Private (secret). You encrypt with my Public key; only I can decrypt with my Private key. Digital Certificates bind a Public Key to an identity (website). Certificate Authorities (CAs) like Let’s Encrypt sign these certificates to prove they’re real. Your browser trusts CAs, so it trusts the site.",
        "advanced": "**PKI Components:**\n- **Key Pair:** Public (encrypt/verify) and Private (decrypt/sign).\n- **Certificate:** X.509 format containing Public Key, Identity, CA Signature, Validity.\n- **CA (Certificate Authority):** Trusted third party that signs certificates.\n- **Chain of Trust:** Root CA → Intermediate CA → Server Certificate.\n\n**Verification:**\nBrowser checks certificate signature against trusted Root CA store. Validates domain name (CN/SAN) and expiry."
      },
      {
        "title": "TLS 1.3 Handshake",
        "beginner": "When you visit HTTPS, your browser and server perform a handshake. They agree on encryption methods, exchange keys, and verify identities. TLS 1.3 is faster and safer than older versions. It hides more of the handshake and removes weak options. Once done, all traffic is encrypted.",
        "advanced": "**TLS 1.3 Handshake Steps:**\n1. **ClientHello:** Sends supported cipher suites, random number.\n2. **ServerHello:** Selects cipher, sends certificate, random number.\n3. **Key Exchange:** ECDHE (Elliptic Curve Diffie-Hellman Ephemeral) generates shared secret. Provides Perfect Forward Secrecy (PFS).\n4. **Finished:** Both sides verify handshake integrity.\n\n**Improvements over 1.2:**\n- 1-RTT (faster).\n- Encrypts ServerHello/Certificate (privacy).\n- Removes static RSA, CBC, SHA-1, RC4.\n- Mandates PFS."
      },
      {
        "title": "MITM Prevention",
        "beginner": "TLS prevents Man-in-the-Middle attacks by verifying the server’s certificate. If an attacker tries to intercept, their certificate won’t match the domain or won’t be signed by a trusted CA. Your browser will show a warning. Never ignore these warnings.",
        "advanced": "**MITM Defense:**\n- **Certificate Validation:** Browser checks CN/SAN matches domain.\n- **CA Trust Store:** Only certs signed by trusted CAs accepted.\n- **HSTS (HTTP Strict Transport Security):** Forces HTTPS, prevents downgrade attacks.\n- **Certificate Pinning:** App hardcodes expected certificate/public key (rare in web, common in mobile).\n\n**Failure Modes:**\nSelf-signed certs, expired certs, or mismatched domains trigger browser warnings. Attackers may use rogue CAs or compromised private keys."
      }
    ],
    "practical": {
      "title": "Inspecting TLS Certificates",
      "intro": "Examine a website’s TLS certificate to understand the chain of trust and encryption details.",
      "steps": [
        "Visit an HTTPS site. Click the padlock icon → Connection is secure → Certificate is valid.\n",
        "View Certificate Details: Issuer (CA), Subject (Domain), Validity dates, Public Key algorithm.\n",
        "Check the Certification Path: Root CA → Intermediate → Server.\n",
        "Use OpenSSL: `openssl s_client -connect example.com:443`. View handshake details."
      ],
      "goal": "Understand certificate structure, chain of trust, and TLS verification."
    },
    "quiz": [
      {
        "question": "What does a Certificate Authority (CA) do?",
        "options": [
          "Encrypts data",
          "Signs digital certificates to verify identity",
          "Stores passwords",
          "Blocks hackers"
        ],
        "correctIndex": 1,
        "explanation": "CAs issue and sign digital certificates, binding a public key to an identity. Browsers trust CAs, establishing a chain of trust for HTTPS."
      },
      {
        "question": "What is Perfect Forward Secrecy (PFS)?",
        "options": [
          "Passwords are never stored",
          "Compromised private keys cannot decrypt past sessions",
          "Encryption is unbreakable",
          "Keys are shared publicly"
        ],
        "correctIndex": 1,
        "explanation": "PFS ensures that even if a server’s private key is compromised, past session keys cannot be derived. Achieved via ephemeral key exchange (ECDHE) in TLS 1.3."
      },
      {
        "question": "Why is TLS 1.3 faster than 1.2?",
        "options": [
          "It uses weaker encryption",
          "It requires fewer round trips (1-RTT)",
          "It skips certificate checks",
          "It uses UDP"
        ],
        "correctIndex": 1,
        "explanation": "TLS 1.3 reduces the handshake to 1-RTT (one round trip) by combining key exchange and authentication steps, improving latency."
      }
    ],
    "keyTakeaways": [
      "PKI uses Public/Private keys and CA-signed certificates.",
      "TLS 1.3 handshake is faster (1-RTT) and more secure (PFS).",
      "Certificates verify server identity and enable encryption.",
      "HSTS and certificate validation prevent MITM attacks."
    ]
  },
  {
    "id": "cyber-19",
    "module": "Module 4: Cryptography, Firewalls & Operations",
    "order": 15,
    "title": "Firewalls, IDS/IPS & Network Defenses",
    "icon": "🛡️",
    "terminalNotice": "Firewall rules control traffic. Misconfiguration can expose services.",
    "philosophy": "Defense in depth: Layered security controls reduce risk.",
    "concepts": [
      {
        "title": "Firewall Types",
        "beginner": "Firewalls are gatekeepers. Packet-filtering firewalls check IP addresses and ports (like a bouncer checking IDs). Stateful firewalls remember connections (like remembering who you let in). Next-Gen Firewalls (NGFW) inspect the actual content (like reading the letter). iptables is a Linux firewall tool. UFW is a simpler interface for it.",
        "advanced": "**Firewall Generations:**\n- **Packet-Filtering (Stateless):** Checks source/dest IP, port, protocol. Fast but blind to context.\n- **Stateful:** Tracks connection state (NEW, ESTABLISHED, RELATED). Blocks unsolicited incoming packets.\n- **Next-Gen (NGFW):** Deep Packet Inspection (DPI). Identifies applications (e.g., Facebook vs HTTP), users, and content. Integrates IPS.\n\n**Linux Firewalls:**\n- **iptables:** Low-level rule management. Complex syntax.\n- **UFW (Uncomplicated Firewall):** Frontend for iptables. `ufw allow 22/tcp`."
      },
      {
        "title": "IDS vs IPS",
        "beginner": "IDS (Intrusion Detection System) is like a burglar alarm—it watches and alerts. IPS (Intrusion Prevention System) is like a guard—it watches and blocks. Snort is a popular open-source IDS/IPS. It uses rules to detect bad traffic (like SQLi patterns). Honeypots are fake servers that attract hackers to study them.",
        "advanced": "**IDS (Detection):**\nPassive monitoring. Alerts on signatures (known attacks) or anomalies (unusual behavior). No blocking.\n\n**IPS (Prevention):**\nInline deployment. Actively blocks/drops malicious packets. Risk: False positives can disrupt legitimate traffic.\n\n**Snort Rules:**\nText-based rules defining traffic patterns. Example: `alert tcp any any -> any 80 (msg:'SQLi Attempt'; content:'UNION SELECT'; sid:1001;)`\n\n**Honeypots:**\nDecoy systems (e.g., Cowrie) that mimic vulnerable services. Log attacker behavior for intelligence. Isolated from production network."
      }
    ],
    "practical": {
      "title": "Configuring UFW & Snort Rules",
      "intro": "Configure a basic firewall with UFW and write a simple Snort rule to detect ICMP pings.",
      "steps": [
        "Enable UFW: `sudo ufw enable`. Allow SSH: `sudo ufw allow 22/tcp`. Deny all else: `sudo ufw default deny incoming`.\n",
        "Check status: `sudo ufw status verbose`.\n",
        "Write a Snort rule: `alert icmp any any -> any any (msg:'ICMP Ping Detected'; sid:100001; rev:1;)`. Save to local.rules.\n",
        "Run Snort in test mode to verify rule syntax."
      ],
      "goal": "Understand basic firewall configuration and IDS rule structure."
    },
    "quiz": [
      {
        "question": "What is the difference between IDS and IPS?",
        "options": [
          "IDS blocks, IPS alerts",
          "IDS alerts, IPS blocks",
          "They are the same",
          "IDS is for firewalls"
        ],
        "correctIndex": 1,
        "explanation": "IDS (Intrusion Detection System) monitors and alerts on suspicious activity. IPS (Intrusion Prevention System) actively blocks/drops malicious traffic."
      },
      {
        "question": "What does a Stateful firewall track?",
        "options": [
          "Only IP addresses",
          "Connection state (NEW, ESTABLISHED)",
          "File contents",
          "User passwords"
        ],
        "correctIndex": 1,
        "explanation": "Stateful firewalls track the state of active connections, allowing return traffic for established sessions while blocking unsolicited incoming packets."
      },
      {
        "question": "What is a Honeypot?",
        "options": [
          "A secure server",
          "A decoy system to attract attackers",
          "A firewall rule",
          "A password manager"
        ],
        "correctIndex": 1,
        "explanation": "A honeypot is a decoy system designed to attract attackers, allowing defenders to study their techniques and gather intelligence without risking production assets."
      }
    ],
    "keyTakeaways": [
      "Firewalls filter traffic: Stateless (IP/Port), Stateful (Connection), NGFW (Content).",
      "IDS alerts; IPS blocks. Snort is a common open-source tool.",
      "Honeypots deceive attackers for intelligence gathering.",
      "UFW simplifies iptables management on Linux."
    ]
  },
  {
    "id": "cyber-20",
    "module": "Module 4: Cryptography, Firewalls & Operations",
    "order": 16,
    "title": "Security Mindset, Incident Response & Ethical Reporting",
    "icon": "🎯",
    "terminalNotice": "Ethical hacking requires permission. Unauthorized access is a crime.",
    "philosophy": "Security is a process, not a product. Think like an attacker, defend like a pro.",
    "concepts": [
      {
        "title": "The CIA Triad",
        "beginner": "Security rests on three pillars: Confidentiality (secrets stay secret), Integrity (data isn’t changed), and Availability (systems stay up). If any pillar fails, security is broken. Encryption protects Confidentiality. Hashing protects Integrity. Backups protect Availability.",
        "advanced": "**CIA Triad:**\n- **Confidentiality:** Prevent unauthorized disclosure. Controls: Encryption, Access Control, Steganography.\n- **Integrity:** Prevent unauthorized modification. Controls: Hashing, Digital Signatures, Version Control.\n- **Availability:** Ensure timely access. Controls: Redundancy, Load Balancing, DDoS mitigation, Backups.\n\n**Non-Repudiation:** Often added as 4th pillar. Ensures actions can be traced to individuals (Logging, Digital Signatures)."
      },
      {
        "title": "Incident Response Cycle",
        "beginner": "When a hack happens, follow the cycle: Detect (find it), Contain (stop the spread), Eradicate (remove the hacker), Recover (restore systems), and Learn (fix the hole). Don’t just reboot—preserve evidence. Logs are critical for forensics.",
        "advanced": "**NIST Incident Response Lifecycle:**\n1. **Preparation:** Tools, training, policies.\n2. **Detection & Analysis:** SIEM alerts, log analysis, triage.\n3. **Containment:** Short-term (isolate host) and Long-term (network segmentation).\n4. **Eradication:** Remove malware, close vulnerabilities, reset credentials.\n5. **Recovery:** Restore from clean backups, monitor for reinfection.\n6. **Post-Incident Activity:** Lessons learned, update policies, legal reporting.\n\n**Forensics:** Preserve memory dumps, disk images, and logs. Chain of custody is critical for legal proceedings."
      },
      {
        "title": "Ethical Reporting & Bug Bounties",
        "beginner": "If you find a bug, report it responsibly. Don’t exploit it. Contact the company via their security page or a Bug Bounty platform like HackerOne. Follow their rules: no data deletion, no DoS, no privacy violations. Responsible disclosure gives them time to fix it before going public.",
        "advanced": "**Responsible Disclosure:**\n1. Verify vulnerability (minimal impact proof).\n2. Report via official channel (security.txt, Bug Bounty platform).\n3. Provide detailed report: Steps to reproduce, impact, remediation.\n4. Allow reasonable time for fix (usually 90 days).\n5. Publish only after fix or mutual agreement.\n\n**Bug Bounty Platforms:** HackerOne, Bugcrowd, Intigriti.\n**Legal:** Get written permission. Adhere to scope. Avoid GDPR/PII violations."
      }
    ],
    "practical": {
      "title": "Writing a Vulnerability Report",
      "intro": "Draft a professional vulnerability report for a hypothetical XSS flaw, following responsible disclosure standards.",
      "steps": [
        "Define the vulnerability: Reflected XSS in search parameter.\n",
        "Document Steps to Reproduce: Clear, numbered steps with payloads.\n",
        "Assess Impact: Session theft potential.\n",
        "Propose Remediation: Output encoding, CSP.\n",
        "Format report: Title, Summary, Severity, Details, Remediation."
      ],
      "goal": "Learn to communicate security findings professionally and ethically."
    },
    "quiz": [
      {
        "question": "What are the three pillars of the CIA Triad?",
        "options": [
          "Control, Integrity, Access",
          "Confidentiality, Integrity, Availability",
          "Code, Internet, Apps",
          "Crypto, IDS, Antivirus"
        ],
        "correctIndex": 1,
        "explanation": "The CIA Triad consists of Confidentiality (secrecy), Integrity (accuracy), and Availability (uptime), forming the core model of information security."
      },
      {
        "question": "What is the first step in Incident Response after detection?",
        "options": [
          "Reboot the server",
          "Containment",
          "Delete logs",
          "Public announcement"
        ],
        "correctIndex": 1,
        "explanation": "After detection, immediate containment isolates the threat to prevent spread. Rebooting may destroy forensic evidence; deletion of logs is illegal/unethical."
      },
      {
        "question": "What is Responsible Disclosure?",
        "options": [
          "Posting bugs on Twitter",
          "Privately reporting vulnerabilities to allow time for fixing",
          "Selling bugs to hackers",
          "Ignoring bugs"
        ],
        "correctIndex": 1,
        "explanation": "Responsible disclosure involves privately reporting vulnerabilities to the vendor, allowing them time to patch before public release, minimizing risk to users."
      }
    ],
    "keyTakeaways": [
      "CIA Triad: Confidentiality, Integrity, Availability.",
      "Incident Response: Detect, Contain, Eradicate, Recover, Learn.",
      "Responsible Disclosure protects users and vendors.",
      "Ethical hacking requires permission and adherence to scope."
    ]
  },
  {
    "id": "cyber-2",
    "module": "Module 5: Linux Power & Advanced Systems",
    "order": 17,
    "title": "Linux Internals: Inodes, Links & Filesystem Structure",
    "icon": "📂",
    "terminalNotice": "Warning: Deleting files in /boot or /lib can render the system unbootable. Use chroot jails for dangerous experiments.",
    "philosophy": "Most beginners think a filename is the file. It isn't. In Linux, a filename is just a pointer—a label stuck on a mailbox. The actual mail (data) lives in blocks on the disk, indexed by an **inode**. \n\nIf you understand inodes, hard links, and symbolic links, you understand how Linux manages space, permissions, and recovery. Hackers exploit this: creating infinite loops with symlinks, hiding data in unused inodes, or bypassing permission checks by manipulating link resolution order. Mastering the filesystem hierarchy is mastering the terrain of the battlefield.",
    "concepts": [
      {
        "title": "The Virtual Filesystem (VFS) & Inodes",
        "beginner": "Imagine a library. \n- The **Book** is the data.\n- The **Card Catalog Entry** is the inode. It holds metadata: author, size, location on shelf, and who can borrow it.\n- The **Title on the Shelf** is the filename.\n\nYou can have multiple titles pointing to the same book (Hard Link). You can also have a sign saying \"Go to Section B for Book X\" (Symbolic Link). If you delete the original book, the sign still points to nothing (Broken Symlink), but other titles pointing directly to the physical spot remain valid until all references are gone.",
        "advanced": "**Inode Structure**: Contains metadata (permissions, UID/GID, timestamps, block pointers) but NOT the filename. Filenames reside in directory entries.\n- **Hard Links (`ln target link_name`)**: Multiple directory entries point to the same inode number. Reference count increases. File is only deleted when ref_count == 0. Cannot cross filesystem boundaries. Cannot link directories (to prevent cycles).\n- **Symbolic Links (`ln -s target link_name`)**: A special file type containing the path string to another file. Has its own inode. Can cross FS boundaries. Can link directories. Vulnerable to **Symlink Attacks** (e.g., `/tmp/race_condition` linking to `/etc/shadow`).\n- **Filesystem Types**: \n  - Ext4: Journaling, robust.\n  - XFS: High performance for large files.\n  - OverlayFS: Used in Docker/Containers. Layers read-only image + writable upper layer. Critical for container escape analysis.\n- **Commands**: \n  - `ls -i`: Show inode numbers.\n  - `stat filename`: Detailed inode info (Size, Blocks, IO Block, Device, Inode, Links, Access/Modify/Change times).\n  - `df -h`: Disk free space. `du -sh`: Directory usage."
      },
      {
        "title": "FHS Compliance & Hidden Artifacts",
        "beginner": "The Filesystem Hierarchy Standard (FHS) organizes Linux like a corporate HQ.\n- `/bin` & `/sbin`: Essential binaries. If these break, the OS dies.\n- `/usr`: User-installed software. Large, shared, read-only mostly.\n- `/opt`: Add-on applications (like Chrome, VS Code). Self-contained.\n- `/proc` & `/sys`: **Virtual Filesystems**. These don't exist on disk! They are interfaces to the Kernel. `/proc/cpuinfo` reads RAM/CPU stats live. `/sys/class/net` shows network card status. Hackers read `/proc/self/maps` to see memory layout for buffer overflow exploits.",
        "advanced": "**Forensic Relevance of Directories**:\n- `/var/log`: Primary evidence source. \n  - `auth.log` / `secure`: SSH logins, sudo events.\n  - `kern.log`: Kernel panics, hardware errors.\n  - `syslog`: General system messages.\n  - *Anti-Forensics*: Attackers truncate logs (`> /var/log/auth.log`) or manipulate timestamps (`touch -t 202001010000 file`). Check inode Change time (`ctime`) vs Modify time (`mtime`). If `ctime` > `mtime`, the file was likely tampered with.\n  \n- `/tmp` & `/var/tmp`: World-writable sticky bit directories. Common drop zones for malware. Monitor for executable files here (`find /tmp -type f -executable`).\n  \n- `/proc` & `/sys` Exploitation:\n  - Reading `/proc/[pid]/environ`: Leaks environment variables (AWS keys, DB passwords) of running processes.\n  - Writing to `/proc/sys/kernel/core_pattern`: Can redirect crash dumps to execute arbitrary code upon application failure (Privilege Escalation vector)."
      },
      {
        "title": "Navigation Efficiency: Globbing & Brace Expansion",
        "beginner": "Typing full paths is slow. Linux offers shortcuts.\n- **Globbing**: Using wildcards `*` (anything) and `?` (one char). `rm *.log` deletes all log files.\n- **Brace Expansion**: `{start,end}` creates combinations. `mkdir dir{1..5}` creates dir1, dir2...dir5. `cp file.{txt,bak}` copies file.txt to file.bak.\nExperts use these to manipulate hundreds of files in one command, reducing human error and increasing speed.",
        "advanced": "**Advanced Shell Features for Pentesters**:\n- **Nullglob (`shopt -s nullglob`)**: Prevents commands from failing if no files match wildcard. Crucial for scripting.\n- **Recursive Globbing (`**`)**: In Bash 4+, `echo **/*.py` finds all python files recursively. Requires `shopt -s globstar`.\n- **Command Substitution (`$(...)`)**: Embed output of one command into another. \n  - Example: `kill $(pgrep -f \"malware_process\")` kills all processes matching name.\n  - Danger: Word splitting. If filenames have spaces, this breaks. Use arrays or `xargs`.\n- **History Expansion (`!!`, `!$`)**: \n  - `sudo !!`: Re-run last command as root.\n  - `vim !$`: Edit the last argument of previous command.\n  - *OpSec Note*: Clear history (`history -c`) after sensitive ops, but remember `.bash_history` persists on disk unless configured otherwise (`HISTFILE=/dev/null`)."
      }
    ],
    "practical": {
      "title": "Symbolic Links & Inode Inspection",
      "intro": "Practice creating and inspecting symbolic links to understand how Linux resolves file paths and permissions.",
      "steps": [
        "ls -la",
        "ln -s /etc/passwd user_link",
        "ls -l user_link",
        "cat user_link"
      ],
      "goal": "Create a symbolic link pointing to a system file and verify its inode pointer using ls -l."
    },
    "quiz": [
      {
        "question": "You delete a file that is currently open by a process. What happens to the disk space?",
        "options": [
          "Space is freed immediately.",
          "Space is marked free but not reclaimed until the process closes the file descriptor.",
          "The process crashes.",
          "Nothing happens."
        ],
        "correctIndex": 1,
        "explanation": "Linux keeps the inode alive as long as there is an open file descriptor. The directory entry is removed, but the data blocks remain allocated until the last handle is closed. This is useful for forensics (deleted files recoverable if process still holds them)."
      },
      {
        "question": "Which command reveals the inode number of a file?",
        "options": [
          "ls -l",
          "ls -i",
          "stat -i",
          "inode -show"
        ],
        "correctIndex": 1,
        "explanation": "`ls -i` displays the inode number alongside the filename. `stat` shows detailed metadata including inode, but `ls -i` is the quick lookup."
      },
      {
        "question": "Why can't you create a hard link across different partitions/filesystems?",
        "options": [
          "Permission issues.",
          "Inodes are unique only within a specific filesystem.",
          "Hard links require symbolic link support.",
          "It slows down the kernel."
        ],
        "correctIndex": 1,
        "explanation": "Hard links point to an inode number. Inode numbers are local to the filesystem. Two different filesystems can have an inode #100 representing completely different files. Therefore, a hard link cannot resolve an inode outside its native FS."
      }
    ],
    "keyTakeaways": [
      "Filename ≠ File. Inode is the true identity; filename is just a label.",
      "Symlinks are separate files containing paths; Hard links are aliases to the same inode.",
      "/proc and /sys are virtual interfaces to kernel memory/hardware, not disk storage.",
      "TOCTOU races occur when file attributes change between check and use (common with symlinks).",
      "Deleted files may persist on disk if held open by a process (forensic artifact)."
    ]
  },
  {
    "id": "cyber-3",
    "module": "Module 5: Linux Power & Advanced Systems",
    "order": 18,
    "title": "Stream Processing: Pipes, Filters & Regex Mastery",
    "icon": "🌊",
    "terminalNotice": "Tip: Memorize basic regex patterns for IPs, Emails, and JWTs. They appear in almost every CTF challenge.",
    "philosophy": "Data streams like water. Pipes (`|`) are the plumbing that directs flow. Filtering (`grep`, `awk`, `sed`) is the sieve that catches gold nuggets (secrets, errors, IPs) while letting sand (noise) pass through.\n\nAn expert doesn't read logs; they *query* them. By chaining small, single-purpose tools, you build powerful analytical pipelines capable of parsing gigabytes of JSON, XML, or raw binary in seconds. This skill separates script kiddies from engineers who can automate reconnaissance and incident response.",
    "concepts": [
      {
        "title": "Standard Streams (STDIN, STDOUT, STDERR)",
        "beginner": "Every program talks to the OS via three channels:\n1. **STDIN (0)**: Input. Keyboard or pipe.\n2. **STDOUT (1)**: Output. Screen or pipe.\n3. **STDERR (2)**: Errors. Screen (usually red).\n\nPipes connect STDOUT of one cmd to STDIN of next. Redirection sends STDOUT/STDERR to files. Separating them lets you save clean data to a file while keeping error messages visible on screen for debugging.",
        "advanced": "**File Descriptor Manipulation**:\n- `cmd > out.txt`: Redirects FD 1 to file.\n- `cmd 2> err.txt`: Redirects FD 2 to file.\n- `cmd > out.txt 2>&1`: Redirects FD 1 to file, then duplicates FD 2 to wherever FD 1 is going (same file). Merges streams.\n- `cmd | tee output.txt`: Sends stream to both screen AND file. Great for logging interactive sessions.\n\n**Buffering Issues**: \n- Pipes introduce buffering. `tail -f log | grep \"error\"` might delay output due to libc buffering. \n- Fix: Use `stdbuf -oL tail -f log | grep --line-buffered \"error\"` to force line-buffering for real-time responsiveness."
      },
      {
        "title": "Grep & Sed: Pattern Matching & Stream Editing",
        "beginner": "- **Grep**: Finds lines. Flags: `-v` (invert/exclude), `-E` (extended regex), `-o` (only matching part), `-r` (recursive).\n- **Sed**: Edits streams. \"Stream Editor\". Can replace text globally without opening the file. `sed 's/foo/bar/g'` replaces foo with bar everywhere.\n\nTogether, they allow you to scrub sensitive data (PII) from logs before sharing them, or extract specific fields from messy outputs.",
        "advanced": "**Advanced Grep**:\n- PCRE Support: `grep -P '\b(?:[0-9]{1,3}.){3}[0-9]{1,3}\b' ip_list.txt` (Perl Compatible Regular Expressions for precise IP matching).\n- Context: `grep -B 2 -A 5 \"CRITICAL\" sys.log` (Show 2 lines Before, 5 After).\n\n**Sed Magic**:\n- Delete lines: `sed '/DEBUG/d' app.log` (Remove all debug noise).\n- Print range: `sed -n '10,20p' file.txt` (Print lines 10-20 only).\n- Insertion: `sed '1i#!/bin/bash' script.sh` (Add shebang to line 1).\n\n**AWK (The Swiss Army Knife)**:\n- Field processing: `awk '{print $1, $NF}' access.log` (Print First and Last column).\n- Conditional logic: `awk '$9 == 404 {count++} END {print count}' access.log` (Count 404 errors).\n- Parsing CSV/JSON-like structures without external libraries."
      },
      {
        "title": "Regex for Secret Detection",
        "beginner": "Regular Expressions are pattern languages. \n- `d`: Digit.\n- `[a-z]`: Letter.\n- `.*`: Anything, any amount.\n- `^`: Start of line.\n- `$`: End of line.\n\nHackers use regex to find AWS Keys, Private RSA blocks, or JWT tokens buried in config files or git histories.",
        "advanced": "**Common Pentest Regex Patterns**:\n1. **AWS Access Key ID**: `(A3T[A-Z0-9]|AKIA|AGPA|AIDA|AROA|AIPA|ANPA|ANVA|ASIA)[A-Z0-9]{16}`\n2. **Private Key Header**: `-----BEGIN (RSA|DSA|EC|OPENSSH) PRIVATE KEY-----`\n3. **JWT Token**: `eyJ[A-Za-z0-9_-]*.eyJ[A-Za-z0-9_-]*.[A-Za-z0-9_-]*`\n4. **Slack Webhook**: `https://hooks.slack.com/services/T[a-zA-Z0-9_]{8}/B[a-zA-Z0-9_]{8}/[a-zA-Z0-9_]{24}`\n5. **Generic Password Assignment**: `(?i)(password|passwd|pwd)s*[=:]s*S+`\n\n**Tooling**: \n- Use `trufflehog` or `gitleaks` for automated scanning, but know the underlying regex to customize rules for proprietary formats."
      }
    ],
    "practical": {
      "title": "Log Analysis with Pipes & Grep",
      "intro": "Analyze authentication logs to detect brute-force SSH attacks by chaining Linux pipes.",
      "steps": [
        "cat /var/log/auth.log",
        "cat /var/log/auth.log | grep Failed",
        "cat /var/log/auth.log | grep Failed | wc -l",
        "cat /var/log/auth.log | sort | uniq"
      ],
      "goal": "Filter failed authentication attempts from system logs using grep, wc, and sort."
    },
    "quiz": [
      {
        "question": "What does the command `ls -l | grep \"\\.txt$\" | wc -l` calculate?",
        "options": [
          "Total size of txt files",
          "Number of text files in current directory",
          "Names of all txt files",
          "Permissions of txt files"
        ],
        "correctIndex": 1,
        "explanation": "`ls -l` lists files. `grep \"\\.txt$\"` filters lines ending in .txt. `wc -l` counts the remaining lines. Result: Count of .txt files."
      },
      {
        "question": "Why is `grep -o` useful for extracting secrets?",
        "options": [
          "It searches recursively.",
          "It prints only the matched pattern, not the whole line.",
          "It ignores case.",
          "It colors the output."
        ],
        "correctIndex": 1,
        "explanation": "`-o` (only-matching) suppresses surrounding context. If a line contains \"User: admin Pass: s3cr3t\", `grep -o \"Pass: .*\"` returns \"Pass: s3cr3t\", making it easier to parse programmatically."
      },
      {
        "question": "In AWK, what does `$0` refer to?",
        "options": [
          "The first field",
          "The last field",
          "The entire record (line)",
          "The NR (record number)"
        ],
        "correctIndex": 2,
        "explanation": "In AWK, `$1` is first field, `$NF` is last. `$0` represents the whole input line unchanged."
      }
    ],
    "keyTakeaways": [
      "Pipes connect STDOUT to STDIN, enabling modular tool composition.",
      "Separate STDERR (FD 2) from STDOUT (FD 1) to keep data clean.",
      "Grep/AWK/SED form the holy trinity of text processing.",
      "Regex patterns for AWS/JWT/Private Keys are essential for secret hunting.",
      "Line buffering (`--line-buffered`) is critical for real-time log monitoring."
    ]
  },
  {
    "id": "cyber-4",
    "module": "Module 5: Linux Power & Advanced Systems",
    "order": 19,
    "title": "Access Control Lists (ACLs), CAPs & Privilege Escalation Vectors",
    "icon": "🔓",
    "terminalNotice": "Danger: Misconfiguring ACLs or Capabilities can grant unintended root access. Always revert changes after testing.",
    "philosophy": "Unix permissions (rwx) are blunt instruments. Modern Linux uses granular controls: **ACLs** (Access Control Lists) for per-user/group exceptions, and **Capabilities** to split Root's powers into smaller chunks (e.g., allow binding to port 80 without full root).\n\nAttackers love complexity. Every additional layer of permission (ACL, SELinux, AppArmor, Caps) is a potential misconfiguration. An expert knows how to audit these layers to find the \"golden ticket\"—a file with `chown root:root` but `chmod 777`, or a binary with `cap_net_bind_service` that can be abused for port forwarding.",
    "concepts": [
      {
        "title": "Beyond rwx: POSIX ACLs",
        "beginner": "Sometimes you need: \"Alice can read/write, Bob can only read, Charlie can do nothing.\" Standard Unix groups can't handle this easily. ACLs let you assign permissions to specific users/groups individually.\n\nView with `getfacl`. Set with `setfacl`. If ACLs are present, `ls -l` shows a `+` sign at the end of permissions (e.g., `-rw-rw-r--+`).",
        "advanced": "**Management Commands**:\n- `getfacl file.txt`: Displays detailed ACL entries.\n- `setfacl -m u:bob:r-x file.txt`: Grants bob read/execute.\n- `setfacl -x u:bob file.txt`: Removes bob's entry.\n- `setfacl -b file.txt`: Removes ALL ACLs (reset to standard).\n\n**Security Implications**:\n- Default ACLs on directories propagate to new files (`setfacl -d -m g:devs:rwx /project`).\n- Attack Vector: If a web server user (`www-data`) has write ACL on a config dir, they can overwrite configs.\n- Audit: `find / -type f -exec getfacl {} ; 2>/dev/null | grep \"user:\"` to scan for custom user perms."
      },
      {
        "title": "Linux Capabilities: Splitting Root",
        "beginner": "Root is too powerful. Instead of giving a program full root, we give it specific \"superpowers.\"\n- Want to ping? Need `CAP_NET_RAW`.\n- Want to bind to port 80? Need `CAP_NET_BIND_SERVICE`.\n- Want to load kernel modules? Need `CAP_SYS_MODULE`.\n\nIf a binary has capabilities set, it runs with those elevated privileges even if owned by a normal user. This is safer than SUID, but still risky if the capability is broad.",
        "advanced": "**Inspection & Modification**:\n- `getcap /usr/bin/ping`: Shows assigned caps.\n- `setcap cap_net_raw+p /usr/bin/mytool`: Assigns capability permanently to file.\n- `capsh --print`: Lists current process capabilities.\n\n**Escalation Vectors**:\n1. **Writable Binary with Caps**: If `/usr/local/bin/tool` has `cap_setuid+ep` and is writable by user, they can modify it to spawn a root shell.\n2. **Ambient Capabilities**: Inherited by children. Rarely used correctly.\n3. **Audit Command**: `find / -perm -4000 -o -perm -2000 2>/dev/null` (SUID/SGID) PLUS `getcap -r / 2>/dev/null` (Capabilities). Look for interesting bins like `python`, `perl`, `gcc` with caps."
      },
      {
        "title": "SELinux/AppArmor: Mandatory Access Control (MAC)",
        "beginner": "DAC (Discretionary Access Control) is what we discussed (owner decides). MAC (Mandatory) is decided by the SYSTEM POLICY. Even if you are Root, SELinux might deny you from reading `/etc/shadow` if the policy says \"Web servers cannot read shadow files.\"\n\nIt confines programs. If Apache is hacked, SELinux prevents it from spawning a shell or accessing unrelated files. It's the \"seatbelt\" of Linux.",
        "advanced": "**States**: Enforcing (blocks), Permissive (logs but allows), Disabled.\n- Check status: `getenforce` (SELinux) or `aa-status` (AppArmor).\n- Logs: AVC denials in `/var/log/audit/audit.log` (SELinux) or `dmesg`/`syslog` (AppArmor).\n- Troubleshooting: `ausearch -m avc -ts recent` finds denials. `audit2allow` generates policy fixes.\n\n**Bypass Attempts**:\n- Attackers often try to disable SELinux (`setenforce 0`) if they have root. \n- Detection: Monitor for `setenforce` calls or modifications to `/selinux/enforce`.\n- Container Escape: If Docker runs with `--privileged`, it disables most MAC restrictions, allowing direct device access."
      }
    ],
    "practical": {
      "title": "Auditing SUID Binaries & Permissions",
      "intro": "Search for high-privilege binaries with SUID bits set to evaluate potential privilege escalation paths.",
      "steps": [
        "id",
        "find / -perm -4000 2>/dev/null",
        "ls -la /usr/bin/passwd",
        "cat /etc/shadow"
      ],
      "goal": "Identify SUID binaries running with root permissions and test access to protected files."
    },
    "quiz": [
      {
        "question": "A file has permissions `-rwsr-xr-x`. What does the 's' indicate?",
        "options": [
          "Sticky Bit",
          "SUID Bit",
          "SGID Bit",
          "Setgid Bit"
        ],
        "correctIndex": 1,
        "explanation": "Lowercase 's' in the user execute position indicates SUID (Set User ID). Uppercase 'S' means SUID is set but execute is NOT granted (misconfiguration). Group position 's' is SGID."
      },
      {
        "question": "Why are Linux Capabilities preferred over SUID for granting partial root rights?",
        "options": [
          "They are faster.",
          "They allow granular control (e.g., only network raw sockets) rather than full root.",
          "They hide the file from ls.",
          "They work on Windows too."
        ],
        "correctIndex": 1,
        "explanation": "SUID grants FULL root privileges to the process. Capabilities grant SPECIFIC kernel permissions (like CAP_NET_ADMIN), reducing the blast radius if the binary is exploited."
      },
      {
        "question": "If SELinux is in \"Enforcing\" mode, what happens when a violation occurs?",
        "options": [
          "The action is logged but allowed.",
          "The action is blocked and logged.",
          "The system reboots.",
          "The user is locked out."
        ],
        "correctIndex": 1,
        "explanation": "Enforcing mode actively denies operations that violate the security policy. Permissive mode only logs warnings. Disabled turns off SELinux entirely."
      }
    ],
    "keyTakeaways": [
      "ACLs provide fine-grained user/group permissions beyond standard rwx.",
      "Capabilities split Root powers into manageable chunks (Net, Sys, DAC).",
      "SUID/SGID bits are legacy privesc vectors; audit them rigorously.",
      "MAC (SELinux/AppArmor) restricts even Root, confining compromised services.",
      "World-writable directories in $PATH are critical persistence/privesc risks."
    ]
  },
  {
    "id": "cyber-5",
    "module": "Module 5: Linux Power & Advanced Systems",
    "order": 20,
    "title": "Process Injection, Namespace Isolation & Evasion",
    "icon": "👻",
    "terminalNotice": "Ethical Warning: Process injection techniques described here are dual-use. Use only for authorized red team engagements or malware research in isolated VMs.",
    "philosophy": "Malware doesn't just run; it hides. It injects code into legitimate processes (like `explorer.exe` or `svchost.exe`) to blend in. It manipulates namespaces to isolate itself from the host. It tampers with syscall tables to lie to monitoring tools.\n\nTo catch stealthy threats, defenders must look beyond process names. They analyze memory maps, network connections tied to PIDs, and behavioral anomalies. Understanding how attackers evade detection is the only way to build detectors that actually work.",
    "concepts": [
      {
        "title": "Process Injection & Hollowing",
        "beginner": "Instead of running `evil.exe`, malware loads its code into the memory of `notepad.exe`. Task Manager shows \"Notepad Running,\" but it's actually hosting malicious threads.\n\n**Process Hollowing**: Malware starts a legit process suspended, wipes its memory, writes its own code, and resumes it. The original binary is gone; only the shell remains.",
        "advanced": "**Techniques**:\n1. **DLL Injection**: `LoadLibrary` remote thread. Injects DLL into target process address space.\n2. **Reflective DLL Loading**: Loads DLL from memory without touching disk (no file on disk to scan).\n3. **APC Injection**: Asynchronous Procedure Calls queued to thread. Executes code when thread wakes up.\n4. **Process Doppelgänging**: Uses NTFS transactions to swap file content momentarily during creation.\n\n**Detection**:\n- Monitor for `CreateRemoteThread`, `WriteProcessMemory`, `VirtualAllocEx` syscalls.\n- EDR solutions hook these APIs.\n- Forensics: Dump memory (`LiME`, `WinPmem`) and analyze strings/PE headers in injected regions."
      },
      {
        "title": "Linux Namespaces & Cgroups: Container Isolation",
        "beginner": "Docker containers aren't VMs. They share the host kernel. Isolation comes from **Namespaces** (view isolation) and **Cgroups** (resource limits).\n- PID Namespace: Container sees its processes as PID 1, hiding host processes.\n- NET Namespace: Container has its own IP/Interfaces.\n- MNT Namespace: Container has its own filesystem view.\n\nEscape artists break out of these namespaces to access the host root.",
        "advanced": "**Namespace Inspection**:\n- `ls -l /proc/<pid>/ns/`: Shows namespace IDs (mnt, net, pid, uts, ipc, user).\n- `unshare --mount --uts --ipc --net --pid /bin/bash`: Creates new namespaces manually.\n\n**Container Escape Vectors**:\n1. **Privileged Mode**: `docker run --privileged`. Gives container access to all host devices (`/dev`). Mount host root: `mount /dev/sda1 /mnt/host`.\n2. **Cap_sys_admin**: Allows mounting filesystems. Mount procfs of host: `mount -t proc proc /host_proc`. Read `/host_proc/1/root/etc/shadow`.\n3. **Volumes**: Mounting `/var/run/docker.sock` inside container allows controlling Docker daemon -> spawn privileged sibling container.\n\n**Hardening**: Use User Namespaces (`--userns=host` disabled), Drop all capabilities (`--cap-drop=ALL`), Read-only rootfs."
      },
      {
        "title": "Syscall Tampering & Rootkits",
        "beginner": "Programs talk to the kernel via System Calls (sys_read, sys_write). A **Rootkit** hooks these calls. When you run `ps`, the rootkit intercepts the syscall, removes its own malicious process from the list, and returns the fake result. You literally cannot see the malware with standard tools.",
        "advanced": "**Types**:\n1. **Userland LD_PRELOAD**: Override libc functions. Easy to detect (check env vars).\n2. **Kernel Module (LKM)**: Modifies syscall table in kernel memory. Harder to detect. Requires loading `.ko` module.\n3. **Direct Kernel Object Manipulation (DKOM)**: Unlinks process from kernel task list without unloading it. Process runs but invisible to `ps`/`top`.\n\n**Detection Strategies**:\n- **Cross-Reference**: Compare `/proc` listing vs `sys_call_table` iteration vs Network connections (`ss -antp`). Discrepancies reveal hidden processes.\n- **Integrity Checks**: Verify checksum of kernel memory/code segments.\n- **Tools**: `chkrootkit`, `rkhunter`, `Volatility` (memory forensics).\n- **eBPF**: Modern tracing uses eBPF to monitor syscalls at kernel level, harder to hook than traditional kprobes."
      }
    ],
    "practical": {
      "title": "Process Forensics & Kernel /proc Inspection",
      "intro": "Inspect running system processes and query the virtual /proc filesystem to verify process state.",
      "steps": [
        "ps aux",
        "ls /proc",
        "cat /proc/1/status",
        "top"
      ],
      "goal": "Audit active background processes and inspect init system metadata directly through /proc."
    },
    "quiz": [
      {
        "question": "What is the primary benefit of using eBPF for security monitoring over traditional kernel modules?",
        "options": [
          "It is faster.",
          "It runs in a sandboxed VM inside the kernel, preventing crashes and making it harder to tamper with.",
          "It works on Windows.",
          "It requires no root privileges."
        ],
        "correctIndex": 1,
        "explanation": "eBPF programs are verified by the kernel before loading and run in a restricted sandbox. Unlike LKM rootkits which can corrupt kernel memory, eBPF provides safe, observable instrumentation points."
      },
      {
        "question": "If a Docker container is run with `--privileged`, what security boundary is broken?",
        "options": [
          "Network isolation",
          "Filesystem isolation",
          "All major isolation boundaries (Devices, Capabilities, cgroups)",
          "DNS resolution"
        ],
        "correctIndex": 2,
        "explanation": "--privileged gives the container nearly all host capabilities and access to all devices, effectively removing the security benefits of containerization. It can mount host disks and load kernel modules."
      },
      {
        "question": "How does Process Hollowing differ from DLL Injection?",
        "options": [
          "Hollowing replaces the entire process memory; Injection adds a library to existing memory.",
          "Hollowing is Windows-only; Injection is Linux-only.",
          "Hollowing requires admin rights; Injection does not.",
          "There is no difference."
        ],
        "correctIndex": 0,
        "explanation": "Hollowing suspends a legit process, unmaps its original code sections, writes malicious code, and resumes. Injection typically allocates new memory in a running process and loads a DLL/shared object into it."
      }
    ],
    "keyTakeaways": [
      "Stealth relies on lying to user-space tools (ps, top) via syscall hooks or DKOM.",
      "Compare multiple data sources (/proc, ss, netstat) to detect discrepancies.",
      "Container escapes often stem from excessive privileges (--privileged, Cap_SYS_ADMIN).",
      "Process injection blends malware into trusted binaries to evade signature detection.",
      "Modern defense uses eBPF and memory forensics to bypass traditional rootkit hiding spots."
    ]
  }
];

export const getCyberLessonById = (id: string): CyberLesson | undefined =>
  CYBER_LESSONS.find(l => l.id === id);

export const isCyberLessonUnlocked = (id: string, completedLessons: string[]): boolean => {
  const idx = CYBER_LESSONS.findIndex(l => l.id === id);
  if (idx <= 0) return true;
  const prev = CYBER_LESSONS[idx - 1];
  return completedLessons.includes(prev.id);
};

