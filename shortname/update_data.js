const fs = require('fs');
const fetch = require('node-fetch');

const username = process.argv[2];
const apiUrl = `https://illuxat.com/api/shortname/${username}`;
const dataFilePath = 'data.json';

async function updateData() {
  const response = await fetch(apiUrl);
  const newData = await response.json();

  if (newData && newData.data && newData.data.xats !== undefined) {
    let allData = loadData();
    let previousEntry = findPreviousEntry(allData, username);
    let currentPrice = newData.data.xats;
    let currentDate = new Date().toISOString();
    let newEntry = {
      wantedname: username,
      xats: currentPrice,
      date: currentDate,
      price_change: "0"
    };

    if (previousEntry) {
      let priceDiff = currentPrice - previousEntry.xats;
      let priceChange = (priceDiff > 0 ? "+" : "") + priceDiff;
      newEntry.price_change = priceChange;
      allData = allData.map(entry => entry.wantedname === username ? newEntry : entry);
    } else {
      allData.push(newEntry);
    }

    saveData(allData);
    console.log(`Data updated for ${username}`);
  } else {
    console.log(`Failed to fetch data for ${username}`);
  }
}

function loadData() {
  if (fs.existsSync(dataFilePath)) {
    const json = fs.readFileSync(dataFilePath, 'utf-8');
    return JSON.parse(json);
  } else {
    return [];
  }
}

function saveData(data) {
  fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2));
}

function findPreviousEntry(data, username) {
  return data.find(entry => entry.wantedname === username);
}

updateData();
