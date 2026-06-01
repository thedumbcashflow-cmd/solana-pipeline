export function generateMarketNarrative(data) {
  const { solana, fng, trendingPools } = data;
  
  const tvl = solana.tvl;
  const change = solana.change24h;
  const sentiment = fng.value;

  // Stance Logic (Institutional/Operator Style)
  let stance = "NEUTRAL";
  let reasoning = "";

  if (sentiment > 70 && change > 5) {
    stance = "CAUTION";
    reasoning = "The market is overheating. High volatility coupled with extreme greed suggests a distribution phase. We are looking to de-risk into strength.";
  } else if (sentiment < 30) {
    stance = "AGGRESSIVE ACCUMULATION";
    reasoning = "Maximum pain is often the best entry. Current fear levels represent a significant mismatch between price and long-term network growth.";
  } else if (change > 2 && sentiment > 50) {
    stance = "CONSTRUCTIVE LONG";
    reasoning = "Solana continues to show relative strength. Volume is migrating back to the ecosystem. We remain risk-on while monitoring key liquidation levels.";
  } else {
    stance = "CONSOLIDATION";
    reasoning = "Sideways chop expected. The terminal is monitoring for a clear regime shift. Maintain core positions but avoid leverage in this range.";
  }

  return `OPERATOR STANCE: ${stance}\n\nREASONING: ${reasoning}\n\nTERMINAL DATA: TVL ${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(tvl)} | F&G ${sentiment}`;
}
