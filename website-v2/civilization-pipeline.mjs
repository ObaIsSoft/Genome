import { spawn } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
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
  proc.stdin.write(JSON.stringify(msg) + '\n');
}

async function runMcpSession(calls) {
  return new Promise((resolve, reject) => {
    const proc = spawn(NODE, [SERVER], { env: { ...process.env, ...ENV }, stdio: ['pipe', 'pipe', 'pipe'] });
    let buffer = '';
    const results = {};
    let pendingIdx = 0;

    const sendNext = () => {
      if (pendingIdx >= calls.length) return;
      const call = calls[pendingIdx];
      send(proc, { jsonrpc: '2.0', id: pendingIdx + 10, method: 'tools/call', params: { name: call.tool, arguments: call.args } });
    };

    proc.stdout.on('data', chunk => {
      buffer += chunk.toString();
      const lines = buffer.split('\n');
      buffer = lines.pop(); 
      for (const line of lines) {
        const trimmed = line.trim();
        if (!trimmed || !trimmed.startsWith('{')) continue;
        let msg;
        try { msg = JSON.parse(trimmed); } catch { continue; }
        if (msg.id === 1 && msg.result) {
          send(proc, { jsonrpc: '2.0', method: 'notifications/initialized', params: {} });
          sendNext();
          continue;
        }
        if (msg.id >= 10 && msg.result) {
          const callIdx = msg.id - 10;
          results[calls[callIdx].name] = JSON.parse(msg.result.content[0].text);
          pendingIdx++;
          if (pendingIdx >= calls.length) proc.stdin.end(); else sendNext();
          continue;
        }
      }
    });

    proc.on('close', () => resolve(results));
    proc.on('error', reject);

    send(proc, {
      jsonrpc: '2.0', id: 1, method: 'initialize',
      params: { protocolVersion: '2024-11-05', capabilities: { roots: {}, sampling: {} }, clientInfo: { name: 'pipeline', version: '1.0.0' } }
    });
  });
}

async function main() {
  const OUT = '/Users/obafemi/Documents/dev/genome/website-v2';
  const genomeData = JSON.parse(readFileSync(`${OUT}/genome.json`, 'utf8'));
  const genome = genomeData.genome;
  const INTENT = 'Documentation and product showcase for Genome, a Model Context Protocol server that generates deterministic design systems from a four-layer SHA-256 hash chain.';

  console.log('[1/2] generate_ecosystem...');
  const step1 = await runMcpSession([{
    name: 'ecosystem', tool: 'generate_ecosystem',
    args: { intent: INTENT, seed: genome.dnaHash, genome: genome }
  }]);
  
  if (step1.ecosystem.error) {
    console.error('Ecosystem Error:', step1.ecosystem.error);
    return;
  }
  writeFileSync(`${OUT}/ecosystem.json`, JSON.stringify(step1.ecosystem, null, 2));
  console.log('Saved ecosystem.json');

  console.log('[2/2] generate_civilization...');
  const step2 = await runMcpSession([{
    name: 'civilization', tool: 'generate_civilization',
    args: { 
      intent: INTENT, 
      seed: genome.dnaHash, 
      ecosystem: step1.ecosystem.ecosystem.environment.ecosystemGenome,
      min_tier: 'nation_state' 
    }
  }]);
  
  if (step2.civilization.error) {
    console.error('Civilization Error:', step2.civilization.error);
    return;
  }
  writeFileSync(`${OUT}/civilization.json`, JSON.stringify(step2.civilization, null, 2));
  console.log('Saved civilization.json');
}
main();
