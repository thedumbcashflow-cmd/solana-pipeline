import 'dotenv/config';
import fetch from 'node-fetch';

export async function pushToBufferQueue(drafts) {
  const accessToken = process.env.BUFFER_ACCESS_TOKEN;
  const profileId = process.env.BUFFER_PROFILE_ID;

  if (!accessToken || !profileId) {
    console.warn("BUFFER_ACCESS_TOKEN or BUFFER_PROFILE_ID not set. Skipping Buffer push.");
    return;
  }

  // Modern Buffer API Endpoint
  const url = "https://api.bufferapp.com/1/updates/create.json";

  for (const draft of drafts) {
    try {
      console.log(`Pushing draft to Buffer queue (Modern Auth)...`);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: new URLSearchParams({
          'text': draft,
          'profile_ids[]': profileId,
          'shorten': 'false'
        })
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
