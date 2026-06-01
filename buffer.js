import 'dotenv/config';
import fetch from 'node-fetch';

export async function pushToBufferQueue(drafts) {
  const token = process.env.BUFFER_ACCESS_TOKEN;
  const channelId = process.env.BUFFER_PROFILE_ID;

  if (!token || !channelId) {
    console.warn("BUFFER_ACCESS_TOKEN or BUFFER_PROFILE_ID (Channel ID) not set. Skipping Buffer push.");
    return;
  }

  const url = "https://api.buffer.com";

  for (const item of drafts) {
    try {
      const isString = typeof item === 'string';
      const text = isString ? item : item.text;
      const media = isString ? null : item.media;

      console.log(`Pushing post to TCD Terminal queue...`);

      const input = {
        text: text,
        channelId: channelId,
        schedulingType: "automatic",
        mode: "addToQueue"
      };

      if (media && media.length > 0) {
        input.assets = {
          images: media.map(m => ({ url: m.url }))
        };
      }

      const graphqlQuery = {
        query: `
          mutation CreatePost($input: CreatePostInput!) {
            createPost(input: $input) {
              ... on PostActionSuccess {
                post { id }
              }
              ... on MutationError {
                message
              }
            }
          }
        `,
        variables: { input }
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(graphqlQuery),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
      } else if (result.data?.createPost?.message) {
        console.error("Buffer Mutation Error:", result.data.createPost.message);
      } else {
        console.log(`Successfully scheduled post: ${result.data?.createPost?.post?.id}`);
      }

      // Small delay to respect rate limits
      await new Promise(resolve => setTimeout(resolve, 2000));
    } catch (error) {
      console.error("Error pushing to Buffer GraphQL API:", error);
    }
  }
}
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
/home/engine/.bashrc: line 1: syntax error near unexpected token `('
/home/engine/.bashrc: line 1: `. /etc/profile.d/workload-containment.shn# ~/.bashrc: executed by bash(1) for non-login shells.'
