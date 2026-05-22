/**
 * Genome MCP Pipeline Runner — Proper MCP Protocol
 * Uses full MCP handshake: initialize → initialized → tools/call
 * Run: node run-pipeline.mjs
 */

import { spawn } from 'child_process';
import { writeFileSync, mkdirSync, readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Helper to load .env file
function loadEnv() {
  const possiblePaths = [
    join(process.cwd(), '.env'),
    join(process.cwd(), '..', '.env'),
    join(__dirname, '.env'),
    join(__dirname, '..', '.env'),
  ];
  for (const p of possiblePaths) {
    if (existsSync(p)) {
      try {
        const content = readFileSync(p, 'utf8');
        for (const line of content.split('\n')) {
          const trimmed = line.trim();
          if (!trimmed || trimmed.startsWith('#')) continue;
          const idx = trimmed.indexOf('=');
          if (idx > 0) {
            const key = trimmed.slice(0, idx).trim();
            const val = trimmed.slice(idx + 1).trim().replace(/^['"]|['"]$/g, '');
            if (!process.env[key]) {
              process.env[key] = val;
            }
          }
        }
        break;
      } catch (e) {
        // ignore
      }
    }
  }
}
loadEnv();

const SERVER = '/Users/obafemi/Documents/dev/genome/dist/src/server.js';
const NODE   = '/Users/obafemi/.nvm/versions/node/v22.22.2/bin/node';
const ENV    = {
  GROQ_API_KEY:         process.env.GROQ_API_KEY || '',
  OPENROUTER_API_KEY:   process.env.OPENROUTER_API_KEY || '',
  GEMINI_API_KEY:       process.env.GEMINI_API_KEY || '',
  HUGGINGFACE_API_KEY:  process.env.HUGGINGFACE_API_KEY || '',
  PATH:                 process.env.PATH,
};

function send(proc, msg) {
  const json = JSON.stringify(msg);
  proc.stdin.write(json + '\n');
}

/**
 * MCP session: runs multiple tool calls on one long-lived server process
 * using proper handshake. Resolves when all calls are done.
 */
async function runMcpSession(calls) {
  return new Promise((resolve, reject) => {
    const proc = spawn(NODE, [SERVER], {
      env: { ...process.env, ...ENV },
      stdio: ['pipe', 'pipe', 'pipe']
    });

    let buffer = '';
    const results = {};
    let initialized = false;
    let pendingIdx = 0;

    const sendNext = () => {
      if (pendingIdx >= calls.length) return;
      const call = calls[pendingIdx];
      send(proc, {
        jsonrpc: '2.0',
        id: pendingIdx + 10,   // id 10+ to distinguish from init (id=1)
        method: 'tools/call',
        params: { name: call.tool, arguments: call.args }
      });
      console.log(`  → Sent tools/call id=${pendingIdx + 10}: ${call.tool}`);
    };

    proc.stdout.on('data', chunk => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); // keep incomplete line

      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('{')) continue;
        let msg;
        try { msg = JSON.parse(trimmed); } catch { continue; }

        // 1. Server sent initialize response → send initialized notification
        if (msg.id === 1 && msg.result) {
          console.log('  ✓ initialize handshake complete');
          send(proc, { jsonrpc: '2.0', method: 'notifications/initialized', params: {} });
          initialized = true;
          sendNext();
          continue;
        }

        // 2. Tool call response (id 10+)
        if (msg.id >= 10 && msg.result) {
          const callIdx = msg.id - 10;
          const call = calls[callIdx];
          try {
            const text = msg.result?.content?.[0]?.text;
            results[call.name] = JSON.parse(text);
            console.log(`  ✓ ${call.tool} → ${call.name} complete`);
          } catch (e) {
            console.error(`  ✗ Failed to parse ${call.tool} result:`, e.message);
            results[call.name] = { error: e.message };
          }

          pendingIdx++;
          if (pendingIdx >= calls.length) {
            proc.stdin.end();
          } else {
            sendNext();
          }
          continue;
        }

        // Error response
        if (msg.error) {
          console.error(`  ✗ MCP error for id=${msg.id}:`, JSON.stringify(msg.error));
          if (msg.id >= 10) {
            const callIdx = msg.id - 10;
            results[calls[callIdx]?.name] = { error: msg.error };
            pendingIdx++;
            if (pendingIdx >= calls.length) {
              proc.stdin.end();
            } else {
              sendNext();
            }
          }
        }
      }
    });

    proc.stderr.on('data', d => {
      // Log meaningful errors only (not startup warnings)
      const line = d.toString();
      if (line.includes('ERROR') || line.includes('fatal')) {
        console.error('  server stderr:', line.trim());
      }
    });

    proc.on('close', () => resolve(results));
    proc.on('error', reject);

    // Send MCP initialize handshake
    send(proc, {
      jsonrpc: '2.0', id: 1,
      method: 'initialize',
      params: {
        protocolVersion: '2024-11-05',
        capabilities: { roots: {}, sampling: {} },
        clientInfo: { name: 'pipeline-runner', version: '1.0.0' }
      }
    });
  });
}

async function main() {
  const SEED   = 'genome-mcp-engine-docs';
  const INTENT = 'Documentation and product showcase for Genome, a Model Context Protocol server that generates deterministic design systems from a four-layer SHA-256 hash chain. The site covers installation, tool reference, workflow pipelines, and an interactive demo. Audience: software developers and AI agent engineers. Tone: precise, technical, confident. Content: dense documentation, code snippets, CLI commands, configuration examples.';
  const OUT    = '/Users/obafemi/Documents/dev/genome/website-v2';

  mkdirSync(OUT, { recursive: true });

  // ── STEP 1: generate_design_genome ──────────────────────────────────────
  console.log('\n[1/3] generate_design_genome...');
  const step1 = await runMcpSession([{
    name: 'genomeResult',
    tool: 'generate_design_genome',
    args: { intent: INTENT, seed: SEED, font_provider: 'bunny' }
  }]);

  const genomeResult = step1.genomeResult;
  if (genomeResult.error) throw new Error('generate_design_genome failed: ' + genomeResult.error);

  writeFileSync(`${OUT}/genome.json`, JSON.stringify(genomeResult, null, 2));
  writeFileSync(`${OUT}/tokens.css`, genomeResult.css || '');
  if (genomeResult.svgBiomarker) writeFileSync(`${OUT}/biomarker.svg`, genomeResult.svgBiomarker);

  const genome = genomeResult.genome;
  console.log(`  saved: genome.json, tokens.css`);
  console.log(`  tier=${genomeResult.tier}, complexity=${genomeResult.finalComplexity}`);
  console.log(`  dnaHash=${genome?.dnaHash}`);
  console.log(`  isDark=${genome?.chromosomes?.ch6_color_temp?.isDark}`);
  console.log(`  primary=${genome?.chromosomes?.ch5_color_primary?.hex}`);
  console.log(`  displayFont=${genome?.chromosomes?.ch3_type_display?.displayName}`);
  console.log(`  bodyFont=${genome?.chromosomes?.ch4_type_body?.displayName}`);

  // ── STEP 2: component tokens + design brief (parallel via two sessions) ──
  console.log('\n[2/3] generate_component_tokens + generate_design_brief...');

  const componentSpecs = [
    { name: 'nav-sidebar',    description: 'Sticky sidebar navigation with section links and active state indicator' },
    { name: 'code-block',     description: 'Syntax-highlighted terminal/code snippet with copy button and filename label' },
    { name: 'tool-card',      description: 'Documentation card listing MCP tool name, parameters, and return type' },
    { name: 'install-step',   description: 'Numbered step in a sequential installation guide with CLI command' },
    { name: 'hero-header',    description: 'Top hero section showing product headline, tagline, and primary CTA' },
    { name: 'pipeline-node',  description: 'Visual node in a workflow pipeline diagram showing tool name and arrow connector' },
    { name: 'config-block',   description: 'IDE/JSON configuration block with editor-window chrome frame' },
    { name: 'api-param-row',  description: 'Table row in API reference showing param name, type, required flag, and description' },
  ];

  const [step2a, step2b] = await Promise.all([
    runMcpSession([{
      name: 'tokensResult',
      tool: 'generate_component_tokens',
      args: { genome, component_specs: componentSpecs, output_format: 'both' }
    }]),
    runMcpSession([{
      name: 'briefResult',
      tool: 'generate_design_brief',
      args: { genome, format: 'markdown' }
    }])
  ]);

  const tokensResult = step2a.tokensResult;
  const briefResult  = step2b.briefResult;

  if (!tokensResult.error) {
    writeFileSync(`${OUT}/component-tokens.json`, JSON.stringify(tokensResult, null, 2));
    writeFileSync(`${OUT}/component-tokens.css`, tokensResult.css_variables || '');
    console.log(`  saved: component-tokens.json, component-tokens.css`);
    console.log(`  material=${tokensResult.material_label}, easing=${tokensResult.easing_label}`);
  } else {
    console.error('  component tokens error:', tokensResult.error);
  }

  if (!briefResult.error) {
    writeFileSync(`${OUT}/DESIGN_SYSTEM.md`, briefResult.usage_md || JSON.stringify(briefResult, null, 2));
    writeFileSync(`${OUT}/design-brief.json`, JSON.stringify(briefResult, null, 2));
    console.log(`  saved: DESIGN_SYSTEM.md, design-brief.json`);
  } else {
    console.error('  design brief error:', briefResult.error);
  }

  // ── STEP 3: generate_page_composition ───────────────────────────────────
  console.log('\n[3/3] generate_page_composition...');
  const step3 = await runMcpSession([{
    name: 'compositionResult',
    tool: 'generate_page_composition',
    args: {
      genome,
      intent: INTENT,
      outputFormat: 'spec',
      design_brief: {
        thesis:       briefResult.thesis,
        mandates:     briefResult.mandates,
        antiPatterns: briefResult.anti_patterns
      }
    }
  }]);

  const comp = step3.compositionResult;
  if (!comp.error) {
    writeFileSync(`${OUT}/page-composition.json`, JSON.stringify(comp, null, 2));
    console.log(`  saved: page-composition.json`);
    const sectionTypes = (comp.sections || []).map(s => s.type);
    if (sectionTypes.length) console.log(`  sections: ${sectionTypes.join(' → ')}`);
  } else {
    console.error('  page composition error:', comp.error);
  }

  console.log('\n✅ Pipeline complete. Files in website-v2/:');
  console.log('  genome.json, tokens.css, component-tokens.css, DESIGN_SYSTEM.md, page-composition.json');
}

main().catch(err => {
  console.error('\n❌ Fatal error:', err.message);
  process.exit(1);
});
