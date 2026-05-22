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
  const json = JSON.stringify(msg);
  proc.stdin.write(json + '\n');
}

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
        id: pendingIdx + 10,
        method: 'tools/call',
        params: { name: call.tool, arguments: call.args }
      });
      console.log(`  → Sent tools/call id=${pendingIdx + 10}: ${call.tool}`);
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
          initialized = true;
          sendNext();
          continue;
        }

        if (msg.id >= 10 && msg.result) {
          const callIdx = msg.id - 10;
          const call = calls[callIdx];
          try {
            const text = msg.result?.content?.[0]?.text;
            results[call.name] = JSON.parse(text);
          } catch (e) {
            results[call.name] = { error: e.message };
          }

          pendingIdx++;
          if (pendingIdx >= calls.length) proc.stdin.end();
          else sendNext();
          continue;
        }

        if (msg.error) {
          if (msg.id >= 10) {
            const callIdx = msg.id - 10;
            results[calls[callIdx]?.name] = { error: msg.error };
            pendingIdx++;
            if (pendingIdx >= calls.length) proc.stdin.end();
            else sendNext();
          }
        }
      }
    });

    proc.stderr.on('data', d => {});

    proc.on('close', () => resolve(results));
    proc.on('error', reject);

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
  console.log('\n[Running validate_design]');
  
  // Load local files
  const genomeData = JSON.parse(readFileSync('./genome.json', 'utf8')).genome;
  const cssContent = readFileSync('./src/index.css', 'utf8');
  
  // We'll concatenate a few TSX files to simulate HTML structure for validation
  const htmlContent = readFileSync('./src/App.tsx', 'utf8') + '\n' +
                      readFileSync('./src/pages/Home.tsx', 'utf8') + '\n' +
                      readFileSync('./src/components/Hero.tsx', 'utf8') + '\n' +
                      readFileSync('./src/components/Sidebar.tsx', 'utf8');
                      
  const validationResult = await runMcpSession([{
    name: 'validationResult',
    tool: 'validate_design',
    args: {
      genome: genomeData,
      css_content: cssContent,
      html_content: htmlContent
    }
  }]);

  console.log(JSON.stringify(validationResult.validationResult, null, 2));
}

main().catch(console.error);
