export function generateSocialDrafts(marketData) {
  const { solana, trendingPools } = marketData;
  const topPool = trendingPools[0];

  const drafts = [];

  // 1. The Whale/Volume Alert
  const whaleAlert = `🚨 WHALE VOLUME ALERT\n\nTop moving Solana pool: ${topPool.name}\n24h Volume: $${Number(topPool.volume24h).toLocaleString()}\n\nSomething is brewing in the ecosystem. 🌊\n\n#Solana #Crypto`;
  drafts.push(whaleAlert);

  // 2. The Macro Update
  const macroUpdate = `📊 SOLANA MACRO UPDATE\n\nCurrent Solana TVL: $${(solana.tvl / 1e9).toFixed(2)}B\n24h Change: ${solana.change24h ? solana.change24h.toFixed(2) : '0.00'}%\n\nThe network effect is real. Solana continues to dominate the landscape. 🚀\n\n#Solana #Crypto`;
  drafts.push(macroUpdate);

  // 3. The 'Caught on TCD Terminal' Flex
  const flex = `🚨 CAUGHT ON TCD TERMINAL\n\nSolana TVL is moving ${solana.change24h >= 0 ? 'UP' : 'DOWN'} at ${solana.change24h ? Math.abs(solana.change24h).toFixed(2) : '0.00'}% while ${topPool.name} leads with $${Number(topPool.volume24h).toLocaleString()} in volume.\n\nOur terminal spots the trends before they go viral. ⚡️\n\n#Solana #Crypto`;
  drafts.push(flex);

  // Validate lengths and trim if necessary (Twitter 280 char limit)
  return drafts.map(draft => {
    if (draft.length > 280) {
      return draft.substring(0, 277) + "...";
    }
    return draft;
  });
}
