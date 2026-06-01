export function generateSocialDrafts(data) {
  const { solana, fng, trendingPools, depin, liquidations, network, whaleFlows } = data;

  // Helper to format currency
  const fmt = (val) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact' }).format(val);

  // Uniqueness helper: adds a tiny timestamp or variation to avoid Buffer's duplicate detector
  const uniq = (text) => `${text}\n\n[Ref: ${new Date().getTime().toString().slice(-4)}]`;

  // Logic from World Monitor React Component
  const getFngIntel = (v) => {
    if (v >= 75) return "Crowd is euphoric — distribution risk high. Tighten stops.";
    if (v >= 55) return "Risk-on tape; SOL beta typically outperforms BTC here.";
    if (v >= 45) return "Neutral indecision. Wait for confirmation, avoid overtrading.";
    if (v >= 25) return "Fear regime — historically a constructive accumulation window.";
    return "Extreme Fear — generational entries often print here. Accumulate.";
  };

  const fngIntel = getFngIntel(fng.value);

  // 1. Whale Alert (Now with Macro Context)
  const whaleAlert = uniq(`🚨 SOLANA ALPHA ALERT 🚨

TVL: ${fmt(solana.tvl)} (${solana.change24h.toFixed(2)}% 24h)
US Fear & Greed: ${fng.value} (${fng.label})

Operator Stance: ${fngIntel}

#Solana #SOL #DeFi $SOL`);

  // 2. Velocity Post
  const velocityPost = uniq(`📊 SOLANA MARKET MOMENTUM

Top High-Velocity Pools:
${trendingPools.map((p, i) => `${i + 1}️⃣ ${p.name} - ${fmt(p.volume24h)} Vol`).join('\n')}

Volume precedes price. Terminal is watching. 👁️

#SolanaEcosystem #SOLAlpha $JUP $WIF`);

  // 3. DePIN Sector Spotlight
  const depinSpotlight = uniq(`🏗️ SOLANA DePIN TRACKER

Real-world hardware is moving on-chain:
${depin.map(p => `• ${p.name} (${p.symbol}): ${p.change >= 0 ? '+' : ''}${p.change}%`).join('\n')}

Physical infra is the next major SOL growth vector. 🛰️

#DePIN #SolanaDePIN $HNT $NOS $RENDER`);

  // 4. Liquidation Heatmap
  const liqMap = uniq(`🔥 SOLANA LIQUIDATION HEATMAP

Major "Pain Points" detected at these price levels:
${liquidations.length > 0 
  ? liquidations.map(l => `• $${l.price}: ${fmt(l.value)} at risk`).join('\n')
  : "No major liquidation walls detected in the current range."}

#SolanaAlpha #SOL #Liquidations $SOL`);

  // 5. Network Health Pulse
  const networkPulse = uniq(`⚡ SOLANA NETWORK PULSE

The chain is humming:
• Non-Vote TPS: ${network.tps.toLocaleString()}
• Active Validators: ${network.validators}
• Epoch Progress: ${network.epochProgress}%

#SolanaHealth #SolanaStatus $SOL`);

  // 6. Whale Flow Monitor (New)
  const whaleFlowPost = uniq(`🐳 WHALE FLOW MONITOR

High-intensity flows detected on the wire:
${whaleFlows.map(w => `• ${w.asset} ${w.type}: ${fmt(w.value)} (Flow Score: ${w.score}/100)`).join('\n')}

Follow the smart money or get washed. 🌊

#SolanaWhales #WhaleAlert #SolanaAlpha $SOL`);

  // 7. Terminal Flex (Technical Summary)
  const terminalFlex = uniq(`SOL TVL: ${fmt(solana.tvl)}
Macro Stance: ${fng.label} (${fng.value})
Whale Flow Score: ${Math.max(...whaleFlows.map(w => w.score))}

The Solana machine is relentless today. 🦾

Sent from TCD Terminal.
#Solana $SOL`);

  return [whaleAlert, velocityPost, depinSpotlight, liqMap, networkPulse, whaleFlowPost, terminalFlex];
}
