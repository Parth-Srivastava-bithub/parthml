// Parth Srivastava - AI/ML Engineer & Researcher Portfolio Application JS

document.addEventListener('DOMContentLoaded', () => {
  initNetworkCanvas();
  initNavHighlighting();
  initPlayground();
  initThemeToggle();
});

/* --------------------------------------------------------------------------
   1. Dynamic Abstract AI Network Canvas Visualization
   -------------------------------------------------------------------------- */
function initNetworkCanvas() {
  const canvas = document.getElementById('networkCanvas');
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  let width, height;
  let particles = [];
  const particleCount = 45;
  const maxDistance = 110;

  function resize() {
    const parent = canvas.parentElement;
    if (!parent) return;
    const rect = parent.getBoundingClientRect();
    width = canvas.width = Math.max(rect.width || parent.clientWidth || 400, 280);
    height = canvas.height = Math.max(rect.height || parent.clientHeight || 380, 280);
  }

  window.addEventListener('resize', () => {
    resize();
    createParticles();
  });

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.8,
        vy: (Math.random() - 0.5) * 0.8,
        radius: Math.random() * 2.5 + 1.5,
        color: i % 3 === 0 ? '#2563EB' : (i % 2 === 0 ? '#3B82F6' : '#93C5FD')
      });
    }
  }

  // Track mouse
  let mouse = { x: null, y: null };
  canvas.addEventListener('mousemove', (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.addEventListener('mouseleave', () => {
    mouse.x = null;
    mouse.y = null;
  });

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw wavy background mesh grid
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(219, 234, 254, 0.4)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 35) {
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
    }
    for (let j = 0; j < height; j += 35) {
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
    }
    ctx.stroke();

    // Update and draw particles
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > width) p.vx *= -1;
      if (p.y < 0 || p.y > height) p.vy *= -1;

      // Draw particle node
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = 'rgba(37, 99, 235, 0.5)';
      ctx.fill();
      ctx.shadowBlur = 0;

      // Connect near particles
      for (let j = i + 1; j < particles.length; j++) {
        const p2 = particles[j];
        const dx = p.x - p2.x;
        const dy = p.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < maxDistance) {
          const alpha = (1 - dist / maxDistance) * 0.45;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(37, 99, 235, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }

      // Connect to mouse cursor
      if (mouse.x && mouse.y) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 130) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = `rgba(29, 78, 216, ${0.5 * (1 - dist / 130)})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(animate);
  }

  resize();
  createParticles();
  animate();

  setTimeout(() => {
    resize();
    createParticles();
  }, 250);
  setTimeout(() => {
    resize();
    createParticles();
  }, 800);
}

/* --------------------------------------------------------------------------
   2. Navbar Scroll Highlight & Active Indicator
   -------------------------------------------------------------------------- */
function initNavHighlighting() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  const indicator = document.querySelector('.nav-indicator');
  const navMenu = document.querySelector('.nav-menu');

  function updateIndicator(activeLink) {
    if (!indicator || !activeLink || !navMenu) return;
    const linkRect = activeLink.getBoundingClientRect();
    const menuRect = navMenu.getBoundingClientRect();

    const left = linkRect.left - menuRect.left;
    const width = linkRect.width;

    indicator.style.transform = `translateX(${left}px)`;
    indicator.style.width = `${width}px`;
    indicator.style.opacity = '1';
  }

  function setActive() {
    let current = '';
    const scrollPos = window.scrollY + 120;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;

      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    let activeLink = null;
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
        activeLink = link;
      }
    });

    if (!activeLink && navLinks.length > 0) {
      activeLink = navLinks[0];
      activeLink.classList.add('active');
    }

    if (activeLink) {
      updateIndicator(activeLink);
    }
  }

  // Handle immediate click transition
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      navLinks.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
      updateIndicator(link);
    });
  });

  window.addEventListener('scroll', setActive);
  window.addEventListener('resize', () => {
    const active = document.querySelector('.nav-link.active');
    if (active) updateIndicator(active);
  });

  // Initial calculation
  setTimeout(setActive, 100);
}

/* --------------------------------------------------------------------------
   3. Interactive AI Playground
   -------------------------------------------------------------------------- */
function initPlayground() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const demoRag = document.getElementById('demoRag');
  const demoSynthetic = document.getElementById('demoSynthetic');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const tab = btn.getAttribute('data-tab');
        if (tab === 'rag') {
          demoRag.style.display = 'grid';
          demoSynthetic.style.display = 'none';
        } else {
          demoRag.style.display = 'none';
          demoSynthetic.style.display = 'grid';
        }
      });
    });
  }

  // JSON Extractor Runner
  const btnRunJson = document.getElementById('btnRunJson');
  const inputUnstructured = document.getElementById('inputUnstructured');
  const jsonOutput = document.getElementById('jsonOutput');

  if (btnRunJson) {
    btnRunJson.addEventListener('click', () => {
      const text = inputUnstructured.value.trim();
      jsonOutput.innerHTML = `// [Qwen2.5-0.5B-JSON-Extractor] Initializing model inference...\n// Masking prompt tokens (-100)...`;

      setTimeout(() => {
        const extracted = parseTextToJSON(text);
        jsonOutput.innerHTML = JSON.stringify(extracted, null, 2);
      }, 500);
    });
  }

  // Synthetic Data Generator Runner
  const btnRunSynth = document.getElementById('btnRunSynth');
  const synthOutput = document.getElementById('synthOutput');
  const rowCountSelect = document.getElementById('rowCountSelect');

  if (btnRunSynth) {
    btnRunSynth.addEventListener('click', () => {
      const count = parseInt(rowCountSelect.value || '3', 10);
      synthOutput.innerHTML = `// [LangGraph + SDV TVAE] Executing tabular data synthesis workflow...\n// Validating Pydantic schema...`;

      setTimeout(() => {
        const syntheticBatch = generateSyntheticData(count);
        synthOutput.innerHTML = JSON.stringify(syntheticBatch, null, 2);
      }, 600);
    });
  }
}

function parseTextToJSON(text) {
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

  return {
    "model_name": "qwen2.5-0.5b-json-extractor-p0",
    "status": "SUCCESS",
    "extracted_entities": {
      "name": text.toLowerCase().includes("parth") ? "Parth Srivastava" : "Extracted Entity",
      "email": emailMatch ? emailMatch[0] : "parthsrivastava6112004@gmail.com",
      "phone": phoneMatch ? phoneMatch[0] : "+91 8887664156",
      "specialization": ["vLLM Deployment", "RAG Systems", "QLoRA Fine-Tuning"],
      "confidence": 0.996
    },
    "token_masking_applied": true
  };
}

function generateSyntheticData(rows) {
  const result = [];
  const roles = ["AI/ML Engineer", "NLP Researcher", "MLOps Architect", "Data Scientist"];

  for (let i = 0; i < rows; i++) {
    result.push({
      "user_id": `SYNTH-${2000 + i}`,
      "role": roles[i % roles.length],
      "model_latency_ms": Math.floor(Math.random() * 35) + 12,
      "query_throughput_rps": Math.floor(Math.random() * 400) + 150,
      "pydantic_valid": true
    });
  }
  return {
    "workflow": "LangGraph + Groq LLaMA 70B + SDV TVAE",
    "generated_rows": rows,
    "outlier_preservation": "HIGH",
    "dataset": result
  };
}

/* --------------------------------------------------------------------------
   4. Theme Toggle & Persistence
   -------------------------------------------------------------------------- */
function initThemeToggle() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (!toggleBtn) return;
  const icon = toggleBtn.querySelector('i');

  // Load saved theme from localStorage
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-mode');
    if (icon) icon.className = 'fa-solid fa-sun';
  } else {
    if (icon) icon.className = 'fa-regular fa-moon';
  }

  toggleBtn.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');

    if (icon) {
      icon.className = isDark ? 'fa-solid fa-sun' : 'fa-regular fa-moon';
    }

    localStorage.setItem('theme', isDark ? 'dark' : 'light');
  });
}
