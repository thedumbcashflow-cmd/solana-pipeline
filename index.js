import 'dotenv/config';
import cron from 'node-cron';
import { fetchSolanaMarketData } from './marketData.js';
import { generateSocialDrafts } from './formatter.js';
import { pushToBufferQueue } from './buffer.js';

async function runPipeline() {
  console.log(`[${new Date().toISOString()}] Starting Solana Content Pipeline...`);
  try {
    // 1. Fetch Market Data
    const marketData = await fetchSolanaMarketData();
    
    // 2. Format Drafts
    const drafts = generateSocialDrafts(marketData);
    
    // 3. Push to Buffer
    await pushToBufferQueue(drafts);
    
    console.log(`[${new Date().toISOString()}] Pipeline cycle complete.`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Pipeline error:`, error);
  }
}

// Schedule: Every 4 hours (0 */4 * * *)
cron.schedule('0 */4 * * *', () => {
  runPipeline();
});

console.log("Solana Content Pipeline (Buffer Edition) initialized.");
console.log("Scheduled to run every 4 hours.");

// Immediate execution on start
runPipeline();
