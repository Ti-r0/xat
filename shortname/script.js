document.getElementById('priceForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    await triggerGitHubAction(username);
});

async function triggerGitHubAction(username) {
    const response = await fetch(`https://api.github.com/repos/Ti-r0/xat/actions/workflows/update_data.yml/dispatches`, {
        method: 'POST',
        headers: {
            'Authorization': `token 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`,
            'Accept': 'application/vnd.github.v3+json'
        },
        body: JSON.stringify({
            ref: 'main',
            inputs: { username }
        })
    });

    if (response.ok) {
        console.log(`Triggered update for ${username}`);
    } else {
        console.error('Failed to trigger update:', response.statusText);
    }
}

async function loadData() {
    const response = await fetch('data.json');
    return response.ok ? await response.json() : [];
}

function findPreviousEntry(data, username) {
    return data.find(entry => entry.wantedname === username);
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

async function updateAndDisplay(username) {
    await triggerGitHubAction(username);
    const allData = await loadData();
    const entry = findPreviousEntry(allData, username);
    if (entry) {
        displayPriceChanges(entry);
    } else {
        console.error('No data found for the username.');
    }
}
