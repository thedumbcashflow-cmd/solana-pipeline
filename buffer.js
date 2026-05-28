import 'dotenv/config';

export async function pushToBufferQueue(drafts) {
  const accessToken = process.env.BUFFER_ACCESS_TOKEN;
  const profileId = process.env.BUFFER_PROFILE_ID;

  if (!accessToken || !profileId) {
    console.warn("BUFFER_ACCESS_TOKEN or BUFFER_PROFILE_ID not set. Skipping Buffer push.");
    console.log("Generated Drafts:", drafts);
    return;
  }

  const url = "https://api.bufferapp.com/1/updates/create.json";

  for (const draft of drafts) {
    try {
      console.log(`Pushing draft to Buffer queue...`);
      
      const params = new URLSearchParams();
      params.append('text', draft);
      params.append('profile_ids[]', profileId);
      params.append('access_token', accessToken);
      params.append('shorten', 'false');

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: params
      });

      const result = await response.json();

      if (!response.ok) {
        console.error(`Buffer API error: ${response.status}`, result);
      } else {
        console.log(`Successfully queued update in Buffer: ${result.updates?.[0]?.id || 'Success'}`);
      }

      // Small delay to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error pushing to Buffer:", error);
    }
  }
}
