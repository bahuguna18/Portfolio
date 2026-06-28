document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    lucide.createIcons();

    // 1. Mobile Navigation Menu Toggle
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const menuIcon = document.getElementById('menu-icon');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const isActive = navMenu.classList.contains('active');
            
            // Toggle menu/close icon
            if (isActive) {
                menuIcon.setAttribute('data-lucide', 'x');
            } else {
                menuIcon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        });

        // Close menu when clicking nav links
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                menuIcon.setAttribute('data-lucide', 'menu');
                lucide.createIcons();
            });
        });
    }

    // 2. Interactive Background Canvas (Neural Network / Particles)
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    
    let particles = [];
    const maxParticles = 60;
    const connectionDist = 120;
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.radius = Math.random() * 2 + 1.5;
            this.color = Math.random() > 0.5 ? 'rgba(99, 102, 241, 0.4)' : 'rgba(6, 182, 212, 0.4)'; // Indigo or Cyan
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off boundaries
            if (this.x < 0 || this.x > canvas.width) this.vx = -this.vx;
            if (this.y < 0 || this.y > canvas.height) this.vy = -this.vy;
            
            this.draw();
        }
    }

    // Initialize particles
    for (let i = 0; i < maxParticles; i++) {
        particles.push(new Particle());
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach(p => p.update());

        // Connect particles
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < connectionDist) {
                    const alpha = (1 - dist / connectionDist) * 0.15;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            
            // Connect to mouse
            if (mouse.x && mouse.y) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    const alpha = (1 - dist / 180) * 0.25;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${alpha})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    // 3. Hero Subtitle Typewriter Effect
    const typewriterElement = document.getElementById('typewriter');
    const words = ["Agentic AI Systems.", "Generative AI Solutions.", "RAG & OCR Pipelines.", "Data Science Architectures."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            typewriterElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typewriterElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 100;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            // Wait at end of word
            typingSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // pause before next word
        }

        setTimeout(type, typingSpeed);
    }
    if (typewriterElement) {
        setTimeout(type, 1000);
    }

    // 4. Interactive Agent Terminal CLI
    const terminalBody = document.getElementById('terminal-body');
    const terminalForm = document.getElementById('terminal-form');
    const terminalInput = document.getElementById('terminal-input');
    const shortcutBtns = document.querySelectorAll('.shortcut-btn');

    const terminalAnswers = {
        '/help': [
            { text: 'Retrieving Agent command guide...', type: 'system-msg' },
            { text: `
                <div class="terminal-list">
                    <div class="terminal-list-item"><strong style="color: var(--accent-cyan)">/about</strong> - Read profile summary</div>
                    <div class="terminal-list-item"><strong style="color: var(--accent-cyan)">/experience</strong> - Professional career milestones</div>
                    <div class="terminal-list-item"><strong style="color: var(--accent-cyan)">/skills</strong> - Interactive technical stack</div>
                    <div class="terminal-list-item"><strong style="color: var(--accent-cyan)">/projects</strong> - Highlighted production systems</div>
                    <div class="terminal-list-item"><strong style="color: var(--accent-cyan)">/achievements</strong> - LeetCode, Codeforces, & contest stats</div>
                    <div class="terminal-list-item"><strong style="color: var(--accent-cyan)">/clear</strong> - Clear console window</div>
                </div>
            `, type: 'rich-response' }
        ],
        '/about': [
            { text: 'Querying candidate profile database...', type: 'system-msg' },
            { text: `
                <div style="border-left: 2px solid var(--accent-cyan); padding-left: 0.8rem; margin: 0.5rem 0;">
                    <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">ATUL BAHUGUNA</div>
                    <div style="color: var(--accent-cyan); font-size: 0.8rem; margin-bottom: 0.4rem;">Consultant & Data Scientist</div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Specializes in architecting Agentic AI systems, Multi-Agent Orchestration, and enterprise RAG/OCR pipelines using Python and Microsoft Agent Framework.</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.2rem;">Contact: <a href="mailto:atul.bahuguna100@gmail.com" style="color: var(--accent-emerald);">atul.bahuguna100@gmail.com</a></p>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">GitHub: <a href="https://github.com/bahuguna18" target="_blank" style="color: var(--accent-cyan);">github.com/bahuguna18</a></p>
                </div>
            `, type: 'rich-response' }
        ],
        '/experience': [
            { text: 'Loading experience timeline payload...', type: 'system-msg' },
            { text: `
                <div class="terminal-list">
                    <div class="terminal-list-item" style="margin-bottom: 0.5rem;">
                        <strong style="color:#fff; font-size: 0.85rem;">Delphi Consulting UAE (Dec 2025 - Present)</strong><br>
                        <span style="color:var(--accent-cyan); font-size:0.75rem; font-weight: 500;">Consultant - Data Scientist | Healthcare AI</span><br>
                        <span style="font-size:0.75rem; color: var(--text-muted);">Serving one of the UAE's leading healthcare organizations, architected a multi-agent AI system using MS Agent Framework (reduces coordination by 50%, used by 60%+ of the organization).</span>
                    </div>
                    <div class="terminal-list-item" style="margin-bottom: 0.5rem;">
                        <strong style="color:#fff; font-size: 0.85rem;">MAQ Software (Apr 2024 - Nov 2025)</strong><br>
                        <span style="color:var(--accent-purple); font-size:0.75rem; font-weight: 500;">Software Engineer I</span><br>
                        <span style="font-size:0.75rem; color: var(--text-muted);">GPT-4 extraction model fine-tuning (+40% accuracy) serving 3,000+ users, Azure serverless container deployment via ARM.</span>
                    </div>
                    <div class="terminal-list-item">
                        <strong style="color:#fff; font-size: 0.85rem;">LTIMindtree (Feb 2023 - Jul 2023)</strong><br>
                        <span style="color:var(--primary); font-size:0.75rem; font-weight: 500;">SDE Intern</span><br>
                        <span style="font-size:0.75rem; color: var(--text-muted);">Document analysis and LLM categorization setups using Azure AI Services.</span>
                    </div>
                </div>
            `, type: 'rich-response' }
        ],
        '/skills': [
            { text: 'Running full system skills scan...', type: 'system-msg' },
            { text: `
                <div style="margin-top: 0.25rem;">
                    <div class="terminal-section-title">Languages</div>
                    <div class="terminal-tags">
                        <span class="term-tag cyan">Python</span>
                        <span class="term-tag cyan">C++</span>
                        <span class="term-tag cyan">Bash/Shell</span>
                        <span class="term-tag cyan">SQL</span>
                    </div>
                    
                    <div class="terminal-section-title purple">AI & ML Frameworks</div>
                    <div class="terminal-tags">
                        <span class="term-tag purple">MS Agent Framework</span>
                        <span class="term-tag purple">Agentic RAG</span>
                        <span class="term-tag purple">Prompt Eng</span>
                        <span class="term-tag purple">LangChain</span>
                        <span class="term-tag purple">TensorFlow</span>
                        <span class="term-tag purple">PyTorch</span>
                    </div>

                    <div class="terminal-section-title indigo">Cloud & DevOps</div>
                    <div class="terminal-tags">
                        <span class="term-tag indigo">Azure Functions</span>
                        <span class="term-tag indigo">Azure OpenAI</span>
                        <span class="term-tag indigo">Docker</span>
                        <span class="term-tag indigo">ARM Templates</span>
                        <span class="term-tag indigo">CI/CD</span>
                        <span class="term-tag indigo">Linux</span>
                    </div>
                </div>
            `, type: 'rich-response' }
        ],
        '/projects': [
            { text: 'Scanning project records...', type: 'system-msg' },
            { text: `
                <div class="terminal-list">
                    <div class="terminal-list-item">
                        <strong style="color: var(--accent-cyan); font-size: 0.85rem;">Real-Time Meeting Intelligence</strong><br>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Teams RTMT voice AI, speaker diarization, auto-MOM, action item extraction.</span>
                    </div>
                    <div class="terminal-list-item" style="margin-top: 0.4rem;">
                        <strong style="color: var(--accent-purple); font-size: 0.85rem;">GenAI Entity & Asset Extraction</strong><br>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Fine-tuned GPT-4 reading, Docker Azure Functions, GDPR compliance.</span>
                    </div>
                    <div class="terminal-list-item" style="margin-top: 0.4rem;">
                        <strong style="color: var(--primary); font-size: 0.85rem;">Customer Report Card System</strong><br>
                        <span style="font-size: 0.75rem; color: var(--text-muted);">Power BI, DAX modeling, RLS security, automated reports.</span>
                    </div>
                </div>
            `, type: 'rich-response' }
        ],
        '/about': [
            { text: 'Querying candidate profile database...', type: 'system-msg' },
            { text: `
                <div style="border-left: 2px solid var(--accent-cyan); padding-left: 0.8rem; margin: 0.5rem 0;">
                    <div style="font-weight: 700; color: #fff; font-size: 0.95rem;">ATUL BAHUGUNA</div>
                    <div style="color: var(--accent-cyan); font-size: 0.8rem; margin-bottom: 0.4rem;">Consultant & Data Scientist</div>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.4rem;">Specializes in architecting Agentic AI systems, Multi-Agent Orchestration, and enterprise RAG/OCR pipelines using Python and Microsoft Agent Framework.</p>
                    <p style="font-size: 0.8rem; color: var(--text-muted); margin-bottom: 0.2rem;">Contact: <a href="mailto:atul.bahuguna100@gmail.com" style="color: var(--accent-emerald);">atul.bahuguna100@gmail.com</a></p>
                    <p style="font-size: 0.8rem; color: var(--text-muted);">GitHub: <a href="https://github.com/bahuguna18" target="_blank" style="color: var(--accent-cyan);">github.com/bahuguna18</a></p>
                </div>
            `, type: 'rich-response' }
        ],
        '/achievements': [
            { text: 'Fetching verified competitive records & academic logs...', type: 'system-msg' },
            { text: `
                <div class="terminal-list">
                    <div class="terminal-list-item"><strong>LeetCode Knight:</strong> Top 3% globally (2000+ rating | handle: WhyAlwaysMe)</div>
                    <div class="terminal-list-item"><strong>Codeforces Specialist:</strong> Rating 1590+ (handle: WowCoder)</div>
                    <div class="terminal-list-item"><strong>CodeChef Global:</strong> Rank 13 worldwide</div>
                    <div class="terminal-list-item"><strong>B.Tech Computer Science:</strong> Graphic Era Hill University (CGPA 83.33%)</div>
                </div>
            `, type: 'rich-response' }
        ]
    };

    // Diagnostic Modal Templates & Logic
    const terminalModal = document.getElementById('terminal-modal');
    const modalBackdrop = document.getElementById('modal-backdrop');
    const modalCloseBtn = document.getElementById('modal-close-btn');
    const modalCloseDot = document.getElementById('modal-close-btn-dot');
    const modalTitleText = document.getElementById('modal-title-text');
    const modalBodyContent = document.getElementById('modal-body-content');

    const modalTemplates = {
        'skills': `
            <div class="modal-grid-skills">
                <div class="modal-skill-card">
                    <div class="modal-skill-card-header">Languages</div>
                    <div class="modal-skill-list">
                        <span class="modal-skill-chip" title="Primary programming language. Used for Agent architectures, ML pipelines, and RAG backend logic.">Python</span>
                        <span class="modal-skill-chip" title="Competitive coding core. LeetCode Knight, Codeforces Specialist. Used for advanced DSA.">C++</span>
                        <span class="modal-skill-chip" title="Linux shell scripts for server environment automation and data jobs.">Bash / Shell</span>
                        <span class="modal-skill-chip" title="Relational database queries and analytics pipelines integration.">SQL</span>
                    </div>
                </div>
                <div class="modal-skill-card">
                    <div class="modal-skill-card-header purple">AI & ML Frameworks</div>
                    <div class="modal-skill-list">
                        <span class="modal-skill-chip" title="Microsoft Agent Framework (Multi-Agent orchestration and autonomous task execution).">MS Agent Framework</span>
                        <span class="modal-skill-chip" title="Agentic RAG and vector database architectures. Fast semantic search retrieval.">Retrieval-Augmented Gen (RAG)</span>
                        <span class="modal-skill-chip" title="Context optimization and prompt strategies (GPT-4, Claude).">Prompt Engineering</span>
                        <span class="modal-skill-chip" title="Model fine-tuning and deployment for domain-specific NLP.">Fine-Tuning & Deployment</span>
                        <span class="modal-skill-chip" title="Chaining LLM agents, memory pipelines, and document processing.">LangChain</span>
                        <span class="modal-skill-chip" title="Deep learning auto-encoders for image completion and denoising.">TensorFlow / PyTorch</span>
                    </div>
                </div>
                <div class="modal-skill-card">
                    <div class="modal-skill-card-header indigo">Cloud & DevOps</div>
                    <div class="modal-skill-list">
                        <span class="modal-skill-chip" title="Azure functions, Azure document intelligence, Cognitive services, Azure OpenAI.">Microsoft Azure</span>
                        <span class="modal-skill-chip" title="Containerizing Azure Function Apps, running local development instances.">Docker</span>
                        <span class="modal-skill-chip" title="Infrastructure as Code (IaC) for automated governance deployments.">ARM Templates</span>
                        <span class="modal-skill-chip" title="Automating build tasks and continuous delivery to Azure apps.">CI/CD Pipelines</span>
                        <span class="modal-skill-chip" title="Host system configurations, bash tools, and script cron setups.">Linux OS</span>
                    </div>
                </div>
                <div class="modal-skill-card">
                    <div class="modal-skill-card-header green">Other Technologies</div>
                    <div class="modal-skill-list">
                        <span class="modal-skill-chip" title="Teams Bot SDK, voice interaction flows and multi-agent channel connects.">MS Teams Integration</span>
                        <span class="modal-skill-chip" title="Real-Time Meeting Transcription voice audio parsing and speaker diarization.">RTMT Voice AI</span>
                        <span class="modal-skill-chip" title="Power BI semantic layers, custom DAX filters, and RLS configs.">Power BI & DAX</span>
                        <span class="modal-skill-chip" title="Automated PII scrubbing and regex content filter templates (GDPR).">PII Regex & GDPR</span>
                    </div>
                </div>
            </div>
            <div class="modal-skill-tip">
                💡 Hover over any skill chip to read diagnostic experience notes from Atul's resume records.
            </div>
        `,
        'projects': `
            <div class="modal-project-item">
                <div class="modal-project-title-row">
                    <span class="modal-project-title">Real-Time Meeting Intelligence</span>
                    <span class="modal-project-metric">60%+ Org Adoption</span>
                </div>
                <div class="modal-project-meta">Delphi Consulting UAE</div>
                <p class="modal-project-desc">
                    Full-stack Teams meeting AI. Features RTMT live transcription, speaker diarization, regex context filters, and auto-generated MOM / action item extraction via Microsoft Agent Framework. Adopted by over 60% of the healthcare organization.
                </p>
            </div>
            <div class="modal-project-item">
                <div class="modal-project-title-row">
                    <span class="modal-project-title">GenAI Entity & Signature Extraction</span>
                    <span class="modal-project-metric">3,000+ Users</span>
                </div>
                <div class="modal-project-meta">MAQ Software</div>
                <p class="modal-project-desc">
                    Spearheaded GenAI stamps, signatures, and entities reader from massive document archives. Fine-tuned GPT-4 models. Serving more than 3,000+ production users for rapid extraction.
                </p>
            </div>
            <div class="modal-project-item">
                <div class="modal-project-title-row">
                    <span class="modal-project-title">Customer Report Card Layer</span>
                    <span class="modal-project-metric">-70% Generation Latency</span>
                </div>
                <div class="modal-project-meta">Enterprise Reporting System</div>
                <p class="modal-project-desc">
                    Power BI semantic engine. Structured Row-Level Security (RLS) credentials, custom DAX measures, dynamic parameters scaling, and automated cron report generation.
                </p>
            </div>
        `,
        'experience': `
            <div class="modal-exp-timeline">
                <div class="modal-exp-item">
                    <div class="modal-exp-dot"></div>
                    <div class="modal-exp-role">Consultant – Data Scientist | Delphi Consulting UAE</div>
                    <div class="modal-exp-details">Dec 2025 - Present | Remote</div>
                    <p class="modal-exp-desc">
                        Serving one of the UAE's leading healthcare organizations, architected a multi-agent AI system using Microsoft Agent Framework, enabling autonomous task orchestration, real-time decision-making, and seamless collaboration across enterprise workflows—reducing manual coordination effort by 50%, with adoption exceeding 60% of the organization.
                    </p>
                </div>
                <div class="modal-exp-item">
                    <div class="modal-exp-dot"></div>
                    <div class="modal-exp-role">Software Engineer I | MAQ Software</div>
                    <div class="modal-exp-details">Apr 2024 - Nov 2025 | Noida, India</div>
                    <p class="modal-exp-desc">
                        GPT-4 model fine-tuning and prompt designs, serving 3,000+ users. Deployed containerized serverless Azure Functions via Docker and ARM templates. GDPR PII masking rules.
                    </p>
                </div>
                <div class="modal-exp-item">
                    <div class="modal-exp-dot"></div>
                    <div class="modal-exp-role">SDE Intern | LTIMindtree</div>
                    <div class="modal-exp-details">Feb 2023 - Jul 2023 | Remote</div>
                    <p class="modal-exp-desc">
                        Generative AI document analytics and classification pipelines using Azure Cognitive Services.
                    </p>
                </div>
            </div>
        `,
        'about': `
            <div class="modal-about-box">
                <div class="modal-about-avatar">
                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="modal-avatar-symbol"><path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z"></path><path d="M12 6a6 6 0 1 0 6 6 6 6 0 0 0-6-6zm0 10a4 4 0 1 1 4-4 4 4 0 0 1-4 4z"></path></svg>
                </div>
                <div class="modal-about-info">
                    <h3 style="color:#fff; font-size:1.1rem; font-weight:700; margin-bottom: 0.15rem;">Atul Bahuguna</h3>
                    <span style="color:var(--accent-cyan); font-size:0.8rem; font-weight: 500;">Data Scientist / AI Engineer</span>
                    <p class="modal-about-quote">
                        "Merging robust algorithmic architectures with multi-agent orchestration core components."
                    </p>
                    <p style="font-size:0.8rem; color:var(--text-muted);">
                        Dedicated to deploying scalable serverless solutions and optimizing complex vector spaces for intelligent RAG retrievals.
                    </p>
                </div>
            </div>
        `,
        'achievements': `
            <div class="modal-ach-grid">
                <div class="modal-ach-card">
                    <span class="modal-ach-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-ach-icon"><path d="M14.5 17.5 3 6V3h3l11.5 11.5"></path><path d="M13 19h8v-8"></path><path d="M16 16 20 20"></path><path d="M19 21h2v-2"></path></svg>
                        LeetCode
                    </span>
                    <span class="modal-ach-metric">Knight</span>
                    <span class="modal-ach-desc">Rating 2000+, Top 3% globally (Handle: WhyAlwaysMe)</span>
                </div>
                <div class="modal-ach-card purple">
                    <span class="modal-ach-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-ach-icon"><circle cx="12" cy="8" r="7"></circle><path d="M8.21 13.89 7 23l5-3 5 3-1.21-9.12"></path></svg>
                        Codeforces
                    </span>
                    <span class="modal-ach-metric">Specialist</span>
                    <span class="modal-ach-desc">Rating exceeding 1590 (Handle: WowCoder)</span>
                </div>
                <div class="modal-ach-card indigo">
                    <span class="modal-ach-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-ach-icon"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                        CodeChef
                    </span>
                    <span class="modal-ach-metric">Rank 13</span>
                    <span class="modal-ach-desc">Global coding contest competing against thousands.</span>
                </div>
                <div class="modal-ach-card green">
                    <span class="modal-ach-title">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="modal-ach-icon"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c0 2 3 3 6 3s6-1 6-3v-5"></path></svg>
                        B.Tech CS
                    </span>
                    <span class="modal-ach-metric">83.33% CGPA</span>
                    <span class="modal-ach-desc">Graphic Era Hill University graduate (2019-2023).</span>
                </div>
            </div>
        `
    };

    function openModal(type) {
        if (!terminalModal || !modalBodyContent || !modalTitleText) return;
        const cleanType = type.trim().toLowerCase();
        
        if (modalTemplates[cleanType]) {
            modalTitleText.textContent = `System Diagnostics: [CMD_${cleanType.toUpperCase()}_PAYLOAD]`;
            modalBodyContent.innerHTML = modalTemplates[cleanType];
            terminalModal.classList.add('active');
            document.body.style.overflow = 'hidden'; // Lock body scroll
        }
    }

    function closeModal() {
        if (!terminalModal) return;
        terminalModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock body scroll
    }

    if (modalCloseBtn) modalCloseBtn.addEventListener('click', closeModal);
    if (modalCloseDot) modalCloseDot.addEventListener('click', closeModal);
    if (modalBackdrop) modalBackdrop.addEventListener('click', closeModal);

    // Escape Key Modal Dismiss
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function appendTerminalLine(content, type = 'response-line') {
        const timeStr = new Date().toLocaleTimeString();
        const line = document.createElement('div');
        line.classList.add('terminal-line', type);
        
        if (type === 'response-line') {
            line.innerHTML = `<span class="term-prompt">&gt;</span> ${content}`;
        } else if (type === 'rich-response') {
            line.innerHTML = content;
        } else if (type === 'user-cmd-line') {
            line.innerHTML = `<span class="term-prompt">guest@atul-web:~$</span> ${content}`;
        } else {
            line.innerHTML = `<span class="term-time">[${timeStr}]</span> ${content}`;
        }
        
        terminalBody.appendChild(line);
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function processCommand(cmd) {
        const cleanCmd = cmd.trim().toLowerCase();
        
        // Remove slash prefix for command analysis if present
        let matchedCmd = cleanCmd;
        if (matchedCmd.startsWith('/')) {
            matchedCmd = matchedCmd.substring(1);
        }
        
        // Alias mappings
        if (matchedCmd === 'project') matchedCmd = 'projects';
        if (matchedCmd === 'work') matchedCmd = 'experience';
        if (matchedCmd === 'achievement') matchedCmd = 'achievements';
        if (matchedCmd === 'me' || matchedCmd === 'contact') matchedCmd = 'about';

        appendTerminalLine(cmd, 'user-cmd-line');

        if (cleanCmd === '/clear' || cleanCmd === 'clear') {
            terminalBody.innerHTML = '';
            appendTerminalLine('Terminal cleared. Awaiting commands...', 'system-msg');
            return;
        }

        // Show thinking status
        appendTerminalLine('Executing agent query...', 'system-msg');

        setTimeout(() => {
            if (modalTemplates[matchedCmd]) {
                appendTerminalLine(`Opening interactive ${matchedCmd} dashboard diagnostics...`, 'response-line');
                openModal(matchedCmd);
            } else if (terminalAnswers[cleanCmd] || terminalAnswers['/' + cleanCmd]) {
                const lines = terminalAnswers[cleanCmd] || terminalAnswers['/' + cleanCmd];
                // Type or render lines sequentially to feel like an agent output
                lines.forEach((lineObj, index) => {
                    setTimeout(() => {
                        appendTerminalLine(lineObj.text, lineObj.type);
                    }, index * 120);
                });
            } else {
                appendTerminalLine(`Command '${cmd}' not recognized. Type '/help' or use the quick shortcut buttons.`, 'response-line');
            }
        }, 300);
    }

    if (terminalForm) {
        terminalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const cmd = terminalInput.value;
            if (cmd) {
                processCommand(cmd);
                terminalInput.value = '';
            }
        });
    }

    shortcutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const cmd = btn.getAttribute('data-cmd');
            processCommand(cmd);
        });
    });

    // 5. Skills Detail Panel Interactive System
    const skillItems = document.querySelectorAll('.skill-item');
    const skillDetailsPanel = document.getElementById('skill-details');
    const skillDetailsContent = document.getElementById('skill-details-content');
    const skillDetailTitle = document.getElementById('skill-detail-title');
    const skillDetailDesc = document.getElementById('skill-detail-desc');
    const panelPlaceholder = skillDetailsPanel ? skillDetailsPanel.querySelector('.panel-placeholder') : null;

    skillItems.forEach(item => {
        item.addEventListener('click', () => {
            const name = item.textContent;
            const desc = item.getAttribute('data-desc');

            // Deactivate others
            skillItems.forEach(i => i.classList.remove('active'));
            item.classList.add('active');

            if (skillDetailsContent && skillDetailTitle && skillDetailDesc && panelPlaceholder) {
                panelPlaceholder.classList.add('hidden');
                skillDetailsContent.classList.remove('hidden');
                
                skillDetailTitle.textContent = name;
                skillDetailDesc.textContent = desc;

                // Add short highlight animation to detail panel
                skillDetailsPanel.style.borderColor = 'var(--accent-cyan)';
                skillDetailsPanel.style.boxShadow = '0 10px 30px rgba(6, 182, 212, 0.15)';
                setTimeout(() => {
                    skillDetailsPanel.style.borderColor = 'var(--border-color)';
                    skillDetailsPanel.style.boxShadow = 'var(--shadow-premium)';
                }, 600);
            }
        });
    });

    // 6. Scroll Reveal Effects using Intersection Observer
    const revealElements = document.querySelectorAll('.scroll-reveal');
    
    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Reveal once
            }
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // 7. Dynamic JSON Contact Form Execution
    const contactForm = document.getElementById('contact-form');
    const contactSuccess = document.getElementById('contact-success');
    const resetFormBtn = document.getElementById('reset-form-btn');
    const successTimestamp = document.getElementById('success-timestamp');

    if (contactForm && contactSuccess && resetFormBtn) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Extract values
            const name = contactForm.querySelector('[name="name"]').value;
            const email = contactForm.querySelector('[name="email"]').value;
            const subject = contactForm.querySelector('[name="subject"]').value;
            const message = contactForm.querySelector('[name="message"]').value;
            
            // Show loading animation on the button
            const submitBtn = contactForm.querySelector('.submit-btn');
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `<i data-lucide="loader-2" class="btn-icon spinner"></i> Compiling Payload...`;
            lucide.createIcons();

            // Simulate compilation and then trigger the email client
            setTimeout(() => {
                contactForm.classList.add('hidden');
                contactSuccess.classList.remove('hidden');
                
                // Print timestamp
                if (successTimestamp) {
                    successTimestamp.textContent = new Date().toISOString();
                }
                
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalHTML;
                lucide.createIcons();

                // Open default email client with pre-filled content
                const mailtoUrl = `mailto:atul.bahuguna100@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("Name: " + name + "\nEmail: " + email + "\n\nMessage:\n" + message)}`;
                window.location.href = mailtoUrl;
            }, 1200);
        });

        resetFormBtn.addEventListener('click', () => {
            contactForm.reset();
            contactSuccess.classList.add('hidden');
            contactForm.classList.remove('hidden');
        });
    }
});
