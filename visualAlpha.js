import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SCREENSHOT_DIR = path.join(__dirname, 'screenshots');
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR);
}

const componentMap = {
  whaleFlow: 'WHALE FLOW MONITOR',
  networkHealth: 'NETWORK HEALTH',
  liquidationHeatmap: 'LIQUIDATION HEATMAP',
  depinTracker: 'DEPIN TRACKER'
};

export async function captureScreenshots() {
  console.log('--- Visual Alpha: Initiating Capture Sequence ---');
  
  try {
    console.log('Ensuring session is on dashboard...');
    execSync(`npx agent-browser open https://tcd-terminal.com/dashboard --session browser`);
    // Wait longer for full hydration
    console.log('Waiting for hydration (12s)...');
    await new Promise(resolve => setTimeout(resolve, 12000));
  } catch (err) {
    console.warn('Navigation failed, will attempt capture on current state.');
  }

  const results = {};

  for (const [key, title] of Object.entries(componentMap)) {
    const filePath = path.join(SCREENSHOT_DIR, `${key}.png`);
    console.log(`Processing ${title}...`);
    
    try {
      // Robust selector: search all elements, find one with text and NO children (the leaf node), then find the bg-card parent.
      const evalCmd = `npx agent-browser eval "{ 
        const el = [...document.querySelectorAll('*')].find(e => e.children.length === 0 && e.innerText?.toUpperCase().includes('${title.toUpperCase()}')); 
        let p = el?.parentElement; 
        while(p && !p.classList.contains('bg-card')) p = p.parentElement; 
        if(p) { 
          const r = p.getBoundingClientRect(); 
          JSON.stringify({x: r.x, y: r.y, w: r.width, h: r.height}); 
        } else { 
          'null' 
        } 
      }" --session browser`;
      
      const rectStr = execSync(evalCmd).toString().trim();
      
      const match = rectStr.match(/\{"x":.+\}/);
      if (match) {
        const rect = JSON.parse(match[0]);
        console.log(`Found ${title} at:`, rect);
        
        const snapCmd = `npx agent-browser screenshot --rect ${Math.floor(rect.x)},${Math.floor(rect.y)},${Math.floor(rect.w)},${Math.floor(rect.h)} --session browser`;
        const snapOutput = execSync(snapCmd).toString();
        
        const snapMatch = snapOutput.match(/Screenshot saved to (.+\.png)/);
        if (snapMatch) {
          const tempPath = snapMatch[1];
          fs.copyFileSync(tempPath, filePath);
          
          try {
            console.log(`Uploading ${key} to file.io...`);
            const uploadCmd = `curl -s -F "file=@${filePath}" https://file.io`;
            const uploadOutput = execSync(uploadCmd).toString();
            const uploadData = JSON.parse(uploadOutput);
            if (uploadData.success) {
              console.log(`Captured ${title} -> ${uploadData.link}`);
              results[key] = uploadData.link;
            } else {
              console.warn(`Upload failed for ${key}: ${uploadOutput}`);
            }
          } catch (uploadErr) {
            console.warn(`Upload error for ${key}:`, uploadErr.message);
          }
        }
      } else {
        console.warn(`Coordinates not found for ${title}. Result: ${rectStr}`);
      }
    } catch (error) {
      console.error(`Error processing ${title}:`, error.message);
    }
  }

  console.log('--- Visual Alpha: Sequence Complete ---');
  return results;
}

if (process.argv[1] === __filename) {
  captureScreenshots().then(res => console.log('Final:', res));
}
