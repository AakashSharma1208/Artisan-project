const Product = require('../models/Product');

// @desc    AI Chatbot endpoint using external API
// @route   POST /api/ai/chat
// @access  Public
exports.chatWithAI = async (req, res) => {
    try {
        const { message } = req.body;
        
        // Ensure API key is set
        if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'YOUR_API_KEY_HERE') {
            return res.status(500).json({ reply: 'AI service is currently not configured. Please add an API key.' });
        }

        const systemPrompt = `You are a helpful assistant for the Artisan marketplace. 
You help users find handmade goods, jewelry, pottery, and art. 
Keep your answers very brief and friendly, limited to 2-3 sentences.`;

        // Direct fetch call to OpenAI to avoid needing the SDK package, keeping it lightweight
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message }
                ],
                max_tokens: 150
            })
        });

        if (!response.ok) {
            console.error('OpenAI Error:', await response.text());
            return res.status(500).json({ reply: 'Sorry, I am having trouble connecting to my brain right now.' });
        }

        const data = await response.json();
        const reply = data.choices[0].message.content.trim();
        
        res.json({ reply });
        
    } catch (error) {
        console.error('Chatbot API Error:', error);
        res.status(500).json({ message: 'Error processing your message' });
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
