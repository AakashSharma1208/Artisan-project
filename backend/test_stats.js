const axios = require('axios');

async function testStats() {
    try {
        console.log('Testing /api/platform-stats...');
        const res = await axios.get('http://localhost:5000/api/platform-stats');
        console.log('STATUS:', res.status);
        console.log('DATA:', JSON.stringify(res.data, null, 2));
    } catch (err) {
        console.error('ERROR:', err.message);
        if (err.response) {
            console.error('RESPONSE DATA:', err.response.data);
        }
    }
}

testStats();
