const express = require('express');
const redis = require('redis');
const router = express.Router();

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost';
const client = redis.createClient({
    url: REDIS_URL
});

(async () => {
    await client.connect();
})();

router.post('/:id/incr', async (req, res) => {
    const { id } = req.params;

    try {
        const cnt = await client.incr(id);
        res.json(cnt);
    } catch(e) {
        res.json(e);
    }
});

module.exports = router;
