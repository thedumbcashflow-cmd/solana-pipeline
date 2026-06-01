import 'dotenv/config';
import cron from 'node-cron';
import { fetchSolanaMarketData } from './marketData.js';
import { generateSocialDrafts } from './formatter.js';
import { generateMarketNarrative } from './narrative.js';
import { pushToBufferQueue } from './buffer.js';
import { captureScreenshots } from './visualAlpha.js';

async function runPipeline() {
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

// Schedule: Every 12 hours (0 */12 * * *) to hit ~100 posts per week target
cron.schedule('0 */12 * * *', () => {
  runPipeline();
});

console.log("Solana Content Pipeline (Buffer Edition) initialized.");
console.log("Scheduled to run every 12 hours (14 posts per day).");

// Immediate execution on start
runPipeline();
