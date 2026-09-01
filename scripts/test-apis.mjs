const BASE_URL = 'http://localhost:3000/api';

async function testEndpoint(name, path, method = 'GET', body = null) {
    try {
        console.log(`Testing ${name} (${method} ${path})...`);
        const options = {
            method,
            headers: {
                'Content-Type': 'application/json'
            }
        };
        if (body) {
            options.body = JSON.stringify(body);
        }

        const response = await fetch(`${BASE_URL}${path}`, options);
        const data = await response.json();
        
        if (response.ok) {
            console.log(`✅ ${name} OK (${response.status})`);
            return data;
        } else {
            console.error(`❌ ${name} FAILED (${response.status}):`, data);
            return null;
        }
    } catch (e) {
        console.error(`❌ ${name} ERROR:`, e.message);
        return null;
    }
}

async function runTests() {
    console.log("Starting API Tests...\n");

    // 1. Summary
    await testEndpoint('Summary API', '/summary');

    // 2. Routes
    const routes = await testEndpoint('Get Routes', '/routes');
    if (routes?.data?.length > 0) {
        await testEndpoint('Get Single Route', `/routes/${routes.data[0].id}`);
    }

    // 3. Stops
    const stops = await testEndpoint('Get Stops', '/stops');
    if (stops?.data?.length > 0) {
        await testEndpoint('Get Single Stop', `/stops/${stops.data[0].id}`);
    }

    // 4. Buses
    const buses = await testEndpoint('Get Buses', '/buses');
    if (buses?.data?.length > 0) {
        await testEndpoint('Get Single Bus', `/buses/${buses.data[0].id}`);
    }

    // 5. Drivers
    const drivers = await testEndpoint('Get Drivers', '/drivers');
    if (drivers?.data?.length > 0) {
        await testEndpoint('Get Single Driver', `/drivers/${drivers.data[0].id}`);
    }

    // 6. Schedules
    const schedules = await testEndpoint('Get Schedules', '/schedules');
    if (schedules?.data?.length > 0) {
        await testEndpoint('Get Single Schedule', `/schedules/${schedules.data[0].id}`);
    }

    // 7. Positions
    await testEndpoint('Get Positions', '/positions');

    // 8. Auth Register (Should fail if already exists, but we test the endpoint)
    await testEndpoint('Register User', '/auth/register', 'POST', {
        name: 'Test User',
        email: 'test' + Date.now() + '@example.com',
        password: 'password123',
        role: 'viewer'
    });

    console.log("\nTests Finished.");
}

runTests();
