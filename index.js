import 'dotenv/config';
import cron from 'node-cron';
import { fetchSolanaMarketData } from './marketData.js';
import { generateSocialDrafts } from './formatter.js';
import { generateMarketNarrative } from './narrative.js';
import { pushToBufferQueue } from './buffer.js';
import { captureScreenshots } from './visualAlpha.js';

async function runPipeline() {
  // Add small random jitter (0-5 minutes) to avoid being exactly on the mark
  const jitterMinutes = Math.floor(Math.random() * 5);
  if (jitterMinutes > 0) {
    console.log(`[${new Date().toISOString()}] Adding ${jitterMinutes}m jitter to maintain non-robotic pattern...`);
    await new Promise(resolve => setTimeout(resolve, jitterMinutes * 60 * 1000));
  }

  console.log(`[${new Date().toISOString()}] Starting Solana Content Pipeline...`);
  try {
    // 1. Fetch Market Data
    const marketData = await fetchSolanaMarketData();
    
    // 2. Capture Visual Alpha
    const imageUrls = await captureScreenshots();

    // 3. Format Drafts
    const drafts = generateSocialDrafts(marketData);
    
    // 4. Generate Institutional Narrative
    const narrative = generateMarketNarrative(marketData);
    const narrativeDraft = `🎙️ TERMINAL NARRATIVE\n\n${narrative}\n\n#SolanaAlpha #SOL #TCD`;
    
    // 5. Attach visuals to relevant posts
    const finalPosts = drafts.map(text => {
      let media = null;
      if (text.includes('WHALE FLOW') && imageUrls.whaleFlow) media = [{ url: imageUrls.whaleFlow }];
      if (text.includes('NETWORK PULSE') && imageUrls.networkHealth) media = [{ url: imageUrls.networkHealth }];
      if (text.includes('LIQUIDATION') && imageUrls.liquidationHeatmap) media = [{ url: imageUrls.liquidationHeatmap }];
      if (text.includes('DePIN TRACKER') && imageUrls.depinTracker) media = [{ url: imageUrls.depinTracker }];
      
      return media ? { text, media } : text;
    });

    finalPosts.push(narrativeDraft);

    // 6. Push to Buffer
    await pushToBufferQueue(finalPosts);
    
    console.log(`[${new Date().toISOString()}] Pipeline cycle complete.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Pipeline error:`, error);
  }
}

// Scheduled Times (New York Time converted to UTC)
// 8:45 AM NY -> 12:45 UTC
// 10:30 AM NY -> 14:30 UTC
// 12:15 PM NY -> 16:15 UTC
// 2:00 PM NY -> 18:00 UTC
// 3:45 PM NY -> 19:45 UTC
// 5:30 PM NY -> 21:30 UTC
// 7:15 PM NY -> 23:15 UTC
// 9:00 PM NY -> 01:00 UTC
// 10:45 PM NY -> 02:45 UTC

const schedules = [
  '45 12 * * *',
  '30 14 * * *',
  '15 16 * * *',
  '00 18 * * *',
  '45 19 * * *',
  '30 21 * * *',
  '15 23 * * *',
  '00 01 * * *',
  '45 02 * * *'
];

schedules.forEach(s => {
  cron.schedule(s, () => {
    console.log(`Triggering scheduled run for cron: ${s}`);
    runPipeline();
  });
});

console.log("Solana Content Pipeline (Buffer Edition) initialized.");
console.log("Specific high-frequency schedule set (105-minute intervals).");

// Immediate execution as requested ("push now")
runPipeline();
