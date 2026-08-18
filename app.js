// Parth Srivastava Portfolio Application JavaScript

document.addEventListener('DOMContentLoaded', () => {
  initTerminal();
  initSkillsFilter();
  initPlayground();
  initCopyButtons();
});

/* -------------------------------------------------------------
 * 1. INTERACTIVE TERMINAL SIMULATOR
 * ------------------------------------------------------------- */
function initTerminal() {
  const terminalBody = document.getElementById('terminalBody');
  const chipButtons = document.querySelectorAll('.cmd-chip');

  if (!terminalBody) return;

  const commands = {
    'fetch-profile': () => {
      return `[SYSTEM LOG] Fetching profile data for Parth Srivastava...
Name: Parth Srivastava
Role: AI/ML Engineer
Location: Ghaziabad, UP, India
Core Focus: LLM Fine-Tuning (QLoRA), RAG Pipelines, AI Agents, vLLM Deployment
Current Company: 4Way Technologies (Nov 2025 – Present)`;
    },
    'run-rag': () => {
      return `[RAG ENGINE] Initializing Knowledge Vector Store (FAISS + LangChain)...
> Loading document chunks... 1,420 chunks loaded.
> Dynamic Sync status: ONLINE (Syncing real-time edits, ingest & delete)
> Query: "What models has Parth deployed?"
> Context matched: Deployed 20+ AI models on RunPod & Novita using Docker, vLLM, and FastAPI.
> Answer generated in 142ms.`;
    },
    'fine-tune': () => {
      return `[QLoRA TRAINING LOG] Model: Qwen2.5-0.5B | Dataset: 10K+ Instruction Samples
> Epoch 1/3 - Loss: 1.452 - Token Masking (-100) Active on Prompt
> Epoch 2/3 - Loss: 0.381 - Validation Accuracy: 98.4%
> Epoch 3/3 - Loss: 0.092 - JSON Schema Extraction Precision: 99.2%
> Model weights saved to HuggingFace Hub: Yellowforesty/qwen2.5-json-extractor-p0`;
    },
    'synthetic-data': () => {
      return `[LANGGRAPH WORKFLOW] Initializing Synthetic Data Pipeline...
> Agent 1: Categorizing features & running Automated EDA
> Agent 2: Executing SDV TVAE Generator with validation retries
> Agent 3: Pydantic Schema Validation passed (0 type violations)
> Generated 10,000 synthetic rows with outlier preservation.`;
    },
    'metrics': () => {
      return `[PROMETHEUS METRICS SUMMARY]
> Total Models Deployed: 20+
> Daily ETL Pipeline Records: 10,000+
> Active Image Gen Users (ComfyUI/SD): 200+
> Average API Latency: 48ms
> Max RPS Load Tested: 1,500 RPS via Locust`;
    },
    'clear': () => {
      terminalBody.innerHTML = `
        <div class="terminal-line"><span class="terminal-prompt">parth@ai-workstation:~$</span> Terminal cleared. Type or click commands below.</div>
      `;
      return null;
    }
  };

  chipButtons.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmdName = chip.getAttribute('data-cmd');
      executeCommand(cmdName);
    });
  });

  function executeCommand(cmdName) {
    const fn = commands[cmdName];
    if (!fn) return;

    // Append Command
    const cmdLine = document.createElement('div');
    cmdLine.className = 'terminal-line';
    cmdLine.innerHTML = `<span class="terminal-prompt">parth@ai-workstation:~$</span> <span class="terminal-cmd">${cmdName}</span>`;
    terminalBody.appendChild(cmdLine);

    const resultText = fn();
    if (resultText) {
      const outputLine = document.createElement('div');
      outputLine.className = 'terminal-output';
      outputLine.innerHTML = resultText.replace(/\n/g, '<br>');
      terminalBody.appendChild(outputLine);
    }

    terminalBody.scrollTop = terminalBody.scrollHeight;
  }
}

/* -------------------------------------------------------------
 * 2. SKILLS FILTERING
 * ------------------------------------------------------------- */
function initSkillsFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const skillCards = document.querySelectorAll('.skill-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      skillCards.forEach(card => {
        if (filter === 'all' || card.getAttribute('data-category') === filter) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* -------------------------------------------------------------
 * 3. INTERACTIVE PLAYGROUND SIMULATORS
 * ------------------------------------------------------------- */
function initPlayground() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  const demoRag = document.getElementById('demoRag');
  const demoSynthetic = document.getElementById('demoSynthetic');

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

  // JSON Extractor Runner
  const btnRunJson = document.getElementById('btnRunJson');
  const inputUnstructured = document.getElementById('inputUnstructured');
  const jsonOutput = document.getElementById('jsonOutput');

  if (btnRunJson) {
    btnRunJson.addEventListener('click', () => {
      const text = inputUnstructured.value.trim();
      jsonOutput.innerHTML = `// [Qwen2.5-0.5B-JSON-Extractor] Processing prompt...\n// Applying token mask (-100) to prompt context...`;
      
      setTimeout(() => {
        const extracted = parseTextToJSON(text);
        jsonOutput.innerHTML = JSON.stringify(extracted, null, 2);
      }, 600);
    });
  }

  // Synthetic Data Generator Runner
  const btnRunSynth = document.getElementById('btnRunSynth');
  const synthOutput = document.getElementById('synthOutput');
  const rowCountSelect = document.getElementById('rowCountSelect');

  if (btnRunSynth) {
    btnRunSynth.addEventListener('click', () => {
      const count = parseInt(rowCountSelect.value || '3', 10);
      synthOutput.innerHTML = `// [LangGraph + SDV TVAE] Analyzing statistical distributions & correlation matrix...\n// Running Pydantic schema validation...`;

      setTimeout(() => {
        const syntheticBatch = generateSyntheticData(count);
        synthOutput.innerHTML = JSON.stringify(syntheticBatch, null, 2);
      }, 700);
    });
  }
}

function parseTextToJSON(text) {
  // Simple NLP/regex heuristic simulation for the live demo
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch = text.match(/[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/);

  return {
    "model_version": "qwen2.5-0.5b-json-extractor-p0",
    "status": "SUCCESS",
    "extracted_entities": {
      "name": text.toLowerCase().includes("parth") ? "Parth Srivastava" : "Extracted Subject",
      "email": emailMatch ? emailMatch[0] : "parthsrivastava6112004@gmail.com",
      "phone": phoneMatch ? phoneMatch[0] : "+91 8887664156",
      "skills_detected": ["RAG", "vLLM", "Docker", "LangGraph", "Fine-Tuning"],
      "confidence_score": 0.994
    },
    "token_masking_applied": true
  };
}

function generateSyntheticData(rows) {
  const result = [];
  const roles = ["AI Engineer", "Data Scientist", "MLOps Architect", "NLP Specialist"];
  
  for (let i = 0; i < rows; i++) {
    result.push({
      "user_id": `SYNTH-${1000 + i}`,
      "role": roles[i % roles.length],
      "model_latency_ms": Math.floor(Math.random() * 45) + 15,
      "daily_queries": Math.floor(Math.random() * 500) + 100,
      "pydantic_schema_valid": true
    });
  }
  return {
    "generator": "LangGraph + Groq LLaMA 70B + SDV TVAE",
    "record_count": rows,
    "outliers_preserved": true,
    "dataset": result
  };
}

/* -------------------------------------------------------------
 * 4. COPY TO CLIPBOARD
 * ------------------------------------------------------------- */
function initCopyButtons() {
  const copyBtn = document.getElementById('copyEmailBtn');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const email = 'parthsrivastava6112004@gmail.com';
      navigator.clipboard.writeText(email).then(() => {
        const originalText = copyBtn.innerText;
        copyBtn.innerText = 'Copied!';
        setTimeout(() => {
          copyBtn.innerText = originalText;
        }, 2000);
      });
    });
  }
}
