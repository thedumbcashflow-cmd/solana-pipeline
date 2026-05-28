export async function postToWebhook(drafts) {
  const url = process.env.WEBHOOK_URL;
  if (!url) {
    console.warn("WEBHOOK_URL not set in environment variables. Skipping webhook post.");
    return;
  }

  for (const draft of drafts) {
    try {
      console.log(`Posting to webhook...`);
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: draft,
          content: draft
        })
      });

      if (!response.ok) {
        console.error(`Failed to post to webhook: ${response.status} ${response.statusText}`);
      } else {
        console.log("Successfully posted draft to webhook.");
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error("Error posting to webhook:", error);
    }
  }
}
