const express = require('express');
const cors = require('cors');

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
        // Try the productinfo API first (works with place IDs)
        const response = await fetch(
            `https://api.roblox.com/marketplace/productinfo?assetId=${placeId}`
        );
        const data = await response.json();
        
        if (data && data.Name) {
            return res.json({ name: data.Name });
        }
        
        // Fallback: Try getting universe ID first, then game details
        const universeResponse = await fetch(
            `https://apis.roblox.com/universes/v1/places/${placeId}/universe`
        );
        const universeData = await universeResponse.json();
        
        if (universeData && universeData.universeId) {
            const gameResponse = await fetch(
                `https://games.roblox.com/v1/games?universeIds=${universeData.universeId}`
            );
            const gameData = await gameResponse.json();
            
            if (gameData.data && gameData.data.length > 0) {
                return res.json({ name: gameData.data[0].name });
            }
        }
        
        res.status(404).json({ error: 'Game not found' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Failed to fetch game' });
    }
});

app.get('/', (req, res) => {
    res.send('Roblox Game Fetcher Bot is running!');
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
