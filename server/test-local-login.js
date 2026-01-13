// Use native fetch (Node 18+)
async function testLogin() {
    const url = 'http://localhost:5001/api/auth/login';
    const credentials = {
        email: 'binuabow@gmail.com',
        password: 'admin123'
    };

    console.log(`Testing login at ${url}...`);
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });

        const status = response.status;
        const data = await response.json().catch(() => null);
        console.log(`Status: ${status}`);
        console.log('Response:', data);
    } catch (error) {
        console.error('Connection failed:', error.message);
    }
}

testLogin();
