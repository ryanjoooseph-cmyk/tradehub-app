// Fail fast with actionable messages before Next build.
const fs = require('fs');

const die = (msg) => { console.error(`\n❌ Preflight: ${msg}\n`); process.exit(1); };

const has = (p) => fs.existsSync(p);
if (!has('app/globals.css')) die('Missing app/globals.css (do not import ./styles.css).');

const pkg = JSON.parse(fs.readFileSync('package.json','utf8'));
const deps = { next: true, react: true, 'react-dom': true, '@supabase/supabase-js': true, openai: true };
for (const d of Object.keys(deps)) if (!((pkg.dependencies||{})[d])) die(`Missing dependency: ${d}`);

const envs = ['NEXT_PUBLIC_SUPABASE_URL','NEXT_PUBLIC_SUPABASE_ANON_KEY'];
for (const e of envs) if (!process.env[e]) console.warn(`⚠️  ${e} not set (ok locally, must exist on Render).`);

const badImports = [
  'a/lib/getBaseUrl',        // wrong path from earlier logs
  './styles.css',            // should be ./globals.css
  "{ api } from 'openai'",   // invalid import shape
];
const scanFiles = (dir) => {
  for (const name of fs.readdirSync(dir)) {
    const p = `${dir}/${name}`;
    const stat = fs.statSync(p);
    if (stat.isDirectory()) scanFiles(p);
    else if (/\.(ts|tsx|js|mjs|jsx|css)$/.test(name)) {
      const s = fs.readFileSync(p,'utf8');
      for (const bad of badImports) if (s.includes(bad)) die(`Found bad import "${bad}" in ${p}`);
    }
  }
};
['app','lib'].filter(has).forEach(scanFiles);

console.log('✅ Preflight OK');
