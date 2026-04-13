const axios = require('axios');
const Product = require('../models/Product');

// @desc    AI Chatbot endpoint using external API
// @route   POST /api/ai/chat
// @access  Public
exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        console.log('--- Chatbot Request Started ---');
        console.log(`User Message: "${message}"`);

        // Ensure API key is set
        const apiKey = process.env.OPENAI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
            console.warn('Backend Warning: OpenAI API key is missing or not configured.');
            return res.status(500).json({ 
                reply: 'AI service is currently not configured on the server. Please check environment variables.' 
            });
        }

        const systemPrompt = `You are a helpful assistant for the Artisan marketplace named "Artisan AI". 
You help users find handmade goods, jewelry, pottery, and art. 
Keep your answers brief (2-3 sentences max) and friendly. 
You are integrated into the Artisan website, an e-commerce platform for high-quality handcrafted products.`;

        try {
            const response = await axios.post('https://api.openai.com/v1/chat/completions', {
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 150
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                }
            });

            const reply = response.data.choices[0].message.content.trim();
            console.log(`AI Response: "${reply}"`);
            console.log('--- Chatbot Request Success ---');
            
            res.json({ reply });

        } catch (apiError) {
            console.error('OpenAI API Error Details:');
            if (apiError.response) {
                console.error(`- Status: ${apiError.response.status}`);
                console.error(`- Data:`, apiError.response.data);
            } else {
                console.error(`- Message: ${apiError.message}`);
            }
            
            // Helpful message for the user
            let userFriendlyMessage = 'Sorry, my AI brain is experiencing technical difficulties. Please try again in a moment.';
            if (apiError.response?.status === 401) userFriendlyMessage = 'AI Authentication failed. Please check the server configuration.';
            if (apiError.response?.status === 429) userFriendlyMessage = 'I am currently receiving too many requests. Please take a quick break!';

            res.status(500).json({ reply: userFriendlyMessage });
        }
        
    } catch (error) {
        console.error('Chatbot Controller Internal Error:', error);
        res.status(500).json({ message: 'Internal server error processing chatbot request' });
    }
};

// @desc    Mock AI Recommendations
// @route   GET /api/ai/recommendations
// @access  Public
exports.getRecommendations = async (req, res) => {
    try {
        // Mock recommendation: Just fetch 4 random products for now
        const products = await Product.aggregate([{ $sample: { size: 4 } }]);
        
        // Populate vendor details since aggregate doesn't do it automatically like find() usually can
        await Product.populate(products, { path: 'vendorId', select: 'vendorName location' });
        
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching recommendations' });
    }
};
