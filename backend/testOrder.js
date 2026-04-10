async function testOrder() {
    try {
        // 1. Login to get token
        console.log("Logging in...");
        const loginRes = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                email: 'aakash@aakashcrafts.com',
                password: 'password123'
            })
        });
        const loginData = await loginRes.json();
        const token = loginData.token;
        console.log("Got token");

        // 2. Post order
        const payload = {
            "products": [
              {
                "productId": "69d87f2bb11d7272760f8868",
                "vendorId": "69d87f2bb11d7272760f885e",
                "quantity": 2,
                "price": 850
              },
              {
                "productId": "69d8712bb11d7272760f8865",
                "vendorId": "69d87f2bb11d7272760f885e",
                "quantity": 2,
                "price": 1200
              }
            ],
            "totalAmount": 4100,
            "shippingAddress": {
              "street": "Demo St",
              "city": "Demo City",
              "country": "Demo Country"
            },
            "paymentMethod": "COD",
            "paymentStatus": "Pending"
        };

        console.log("Submitting order payload...");
        const orderRes = await fetch('http://localhost:5000/api/orders', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(payload)
        });
        
        const data = await orderRes.json();
        console.log("HTTP STATUS:", orderRes.status);
        console.log("RESPONSE:", data);
    } catch (err) {
        console.error("Fetch Error:", err);
    }
}

testOrder();
