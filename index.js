const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get('/fetch-game', async (req, res) => {
    const placeId = req.query.placeId;
    
    if (!placeId) {
        return res.status(400).json({ error: 'placeId is required' });
    }
    
    try {
        const response = await fetch(
            `https://games.roblox.com/v1/games/multiget-place-details?placeIds=${placeId}`
        );
        const data = await response.json();
        
        if (data && data.length > 0) {
            res.json({ name: data[0].name });
        } else {
            res.status(404).json({ error: 'Game not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

app.get('/', (req, res) => {
    res.send('Roblox Game Fetcher Bot is running!');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
