// Content loader and renderer for ShallVhack Ultimate BugBounty Arsenal

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    setupNavigation();
    setupMobileMenu();
    setupScrollTop();
    setupSearch();
    loadContent();
    setupSyntaxHighlighting();
}

// Navigation handling
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link, .sidebar-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            
            // Only handle hash links
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                // Update active states
                document.querySelectorAll('.nav-link, .sidebar-link').forEach(l => {
                    l.classList.remove('active');
                });
                link.classList.add('active');
                
                // Scroll to section
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offset = 90; // Account for fixed navbar
                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - offset;
                    
                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
                
                // Close mobile menu if open
                document.getElementById('sidebar').classList.remove('active');
            }
        });
    });
    
    // Update active link on scroll
    window.addEventListener('scroll', updateActiveLink);
}

function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.pageYOffset + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link, .sidebar-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Mobile menu toggle
function setupMobileMenu() {
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.getElementById('sidebar');
    
    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    // Close sidebar when clicking outside on mobile
    document.addEventListener('click', (e) => {
        if (window.innerWidth <= 1024) {
            if (!sidebar.contains(e.target) && !mobileToggle.contains(e.target)) {
                sidebar.classList.remove('active');
            }
        }
    });
}

// Scroll to top button
function setupScrollTop() {
    const scrollTopBtn = document.getElementById('scrollTop');
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Search functionality
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    let searchTimeout;
    
    searchInput.addEventListener('input', (e) => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
            performSearch(e.target.value);
        }, 300);
    });
}

function performSearch(query) {
    if (!query.trim()) {
        // Reset highlighting
        document.querySelectorAll('.search-highlight').forEach(el => {
            el.classList.remove('search-highlight');
        });
        return;
    }
    
    const contentSections = document.querySelectorAll('.content-section');
    const searchRegex = new RegExp(query, 'gi');
    
    contentSections.forEach(section => {
        const text = section.textContent;
        if (searchRegex.test(text)) {
            section.classList.add('search-highlight');
            // Optionally scroll to first match
        } else {
            section.classList.remove('search-highlight');
        }
    });
}

// Load and render markdown content
async function loadContent() {
    const contentMap = {
        'reconnaissance': '../reconnaissance/README.md',
        'enumeration': '../enumeration/README.md',
        'vulnerabilities': '../vulnerabilities/README.md',
        'payloads': '../payloads/README.md',
        'automation': '../automation/README.md',
        'writeups': '../writeups/README.md',
        'tools': '../tools/README.md',
        'resources': '../resources/README.md'
    };
    
    const container = document.getElementById('content-container');
    
    for (const [id, path] of Object.entries(contentMap)) {
        try {
            const response = await fetch(path);
            if (response.ok) {
                const markdown = await response.text();
                const html = marked.parse(markdown);
                
                const section = document.createElement('section');
                section.id = id;
                section.className = 'content-section fade-in';
                section.innerHTML = html;
                
                container.appendChild(section);
            }
        } catch (error) {
            console.log(`Could not load ${path}:`, error);
            // Create fallback content
            createFallbackContent(id, container);
        }
    }
    
    // Apply syntax highlighting after content is loaded
    setTimeout(() => {
        document.querySelectorAll('pre code').forEach((block) => {
            hljs.highlightElement(block);
        });
    }, 100);
}

// Fallback content if markdown files can't be loaded
function createFallbackContent(id, container) {
    const titles = {
        'reconnaissance': 'Reconnaissance',
        'enumeration': 'Enumeration',
        'vulnerabilities': 'Vulnerabilities',
        'payloads': 'Payloads',
        'automation': 'Automation',
        'writeups': 'Writeups',
        'tools': 'Tools',
        'resources': 'Resources'
    };
    
    const descriptions = {
        'reconnaissance': 'Complete asset discovery workflows including subdomain enumeration, DNS reconnaissance, certificate transparency mining, port scanning, and technology fingerprinting.',
        'enumeration': 'Deep application analysis techniques for API discovery, JavaScript parsing, parameter extraction, and hidden resource identification.',
        'vulnerabilities': 'Comprehensive testing methodologies for XSS, SQLi, SSRF, CSRF, authentication bypasses, authorization flaws, file upload exploits, XXE, and RCE.',
        'payloads': 'Curated payload collections for XSS, SQL injection, SSRF, command injection, template injection, path traversal, and XXE attacks.',
        'automation': 'Time-saving automation with bash one-liners, Python scripts, workflow automation, tool chaining techniques, and custom scanner pipelines.',
        'writeups': 'Summarized real-world findings including high-severity vulnerability discoveries, creative exploitation techniques, and bypass methodologies.',
        'tools': 'Modern tool guides with installation instructions, usage examples, configuration tips, and tool comparison charts.',
        'resources': 'Learning materials including methodology checklists, platform comparison guides, learning paths, report templates, and useful links.'
    };
    
    const section = document.createElement('section');
    section.id = id;
    section.className = 'content-section fade-in';
    section.innerHTML = `
        <h2>${titles[id]}</h2>
        <p>${descriptions[id]}</p>
        <p><strong>Note:</strong> View the full content in the <a href="https://github.com/ShallVhack/ShallVhack-Ultimate-BugBounty-Arsenal/tree/main/${id}" target="_blank">GitHub repository</a>.</p>
    `;
    
    container.appendChild(section);
}

// Syntax highlighting setup
function setupSyntaxHighlighting() {
    if (typeof hljs !== 'undefined') {
        marked.setOptions({
            highlight: function(code, lang) {
                if (lang && hljs.getLanguage(lang)) {
                    return hljs.highlight(code, { language: lang }).value;
                }
                return hljs.highlightAuto(code).value;
            }
        });
    }
}

// Smooth reveal on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all content sections
setTimeout(() => {
    document.querySelectorAll('.content-section, .feature-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });
}, 100);
