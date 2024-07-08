document.getElementById('priceForm').addEventListener('submit', function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    updateData(username);
});

async function updateData(username) {
    const apiUrl = `https://illuxat.com/api/shortname/${username}`;
    const response = await fetch(apiUrl);
    const newData = await response.json();

    if (newData && newData.data && newData.data.xats !== undefined) {
        let allData = await loadData();
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

        await saveData(allData);
        displayPriceChanges(newEntry);
    }
}

async function loadData() {
    const response = await fetch('data.json');
    return response.ok ? await response.json() : [];
}

function findPreviousEntry(data, username) {
    return data.find(entry => entry.wantedname === username);
}

async function saveData(data) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const formData = new FormData();
    formData.append('file', blob, 'data.json');

    await fetch('https://api.github.com/repos/Ti-r0/xat/contents/data.json', {
        method: 'PUT',
        headers: {
            'Authorization': `token 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`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: 'Update data.json',
            content: btoa(unescape(encodeURIComponent(JSON.stringify(data, null, 2)))),
            sha: await getFileSha()
        })
    });
}

async function getFileSha() {
    const response = await fetch('https://api.github.com/repos/YOUR_GITHUB_USERNAME/xat/contents/data.json');
    const data = await response.json();
    return data.sha;
}

function displayPriceChanges(entry) {
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `
        <h2>Results for ${entry.wantedname}</h2>
        <p>Current Price: ${entry.xats} xats</p>
        <p class="${entry.price_change > 0 ? 'price-up' : entry.price_change < 0 ? 'price-down' : ''}">Price Change: ${entry.price_change} xats</p>
        <p>Last Updated: ${entry.date}</p>
    `;
}
