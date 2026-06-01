import fetch from 'node-fetch';
import fs from 'fs';

async function getProfiles() {
  const token = "Cabl__xkPIFz9qXEPoPtbm-W47shi5pqeRQq-xSh_yw";
  const url = `https://api.bufferapp.com/1/profiles.json?access_token=${token}`;
  
  try {
    const res = await fetch(url);
    const data = await res.json();
    if (data && data.length > 0) {
        fs.writeFileSync('id.txt', data[0]._id);
        console.log('ID saved');
    } else {
        fs.writeFileSync('id.txt', 'No profiles found');
    }
  } catch (err) {
    fs.writeFileSync('id.txt', 'Error: ' + err.message);
  }
}

getProfiles();
