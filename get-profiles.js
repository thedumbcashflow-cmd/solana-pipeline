import fetch from 'node-fetch';

async function getProfiles() {
  const token = "Cabl__xkPIFz9qXEPoPtbm-W47shi5pqeRQq-xSh_yw";
  const url = `https://api.bufferapp.com/1/profiles.json?access_token=${token}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
  } catch (err) {
    console.error(err);
  }
}

getProfiles();
