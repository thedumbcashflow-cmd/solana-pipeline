export async function fetchSolanaMarketData() {
  const DEFILLAMA_API = "https://api.llama.fi/v2/chains";
  const GECKOTERMINAL_API = "https://api.geckoterminal.com/api/v2/networks/solana/trending_pools";

  try {
    // Fetch DeFiLlama data
    console.log("Fetching DeFiLlama data...");
    const llamaRes = await fetch(DEFILLAMA_API);
    if (!llamaRes.ok) throw new Error(`DeFiLlama API error: ${llamaRes.status}`);
    const chains = await llamaRes.json();
    const solanaData = chains.find(c => c.name === "Solana");

    if (!solanaData) throw new Error("Solana data not found in DeFiLlama response");

    // Fetch GeckoTerminal data
    console.log("Fetching GeckoTerminal data...");
    const geckoRes = await fetch(GECKOTERMINAL_API);
    if (!geckoRes.ok) throw new Error(`GeckoTerminal API error: ${geckoRes.status}`);
    const geckoData = await geckoRes.json();

    // Process top 3 pools by 24h volume
    const topPools = geckoData.data
      .sort((a, b) => parseFloat(b.attributes.volume_usd.h24) - parseFloat(a.attributes.volume_usd.h24))
      .slice(0, 3)
      .map(pool => ({
        name: pool.attributes.name,
        volume24h: pool.attributes.volume_usd.h24,
        price: pool.attributes.base_token_price_usd,
        address: pool.attributes.address
      }));

    return {
      solana: {
        tvl: solanaData.tvl,
        change24h: solanaData.change_1d ?? solanaData.change_24h ?? 0
      },
      trendingPools: topPools,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error("Error in fetchSolanaMarketData:", error);
    throw error;
  }
}
