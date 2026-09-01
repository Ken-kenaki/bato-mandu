import { Client, Databases, ID } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { XMLParser } from 'fast-xml-parser';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID;
const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID;
const APPWRITE_API_KEY = process.env.APPWRITE_API_KEY;

if (!APPWRITE_ENDPOINT || !APPWRITE_PROJECT_ID || !APPWRITE_DATABASE_ID || !APPWRITE_API_KEY) {
  console.error("Missing required environment variables for Appwrite.");
  process.exit(1);
}

const client = new Client()
    .setEndpoint(APPWRITE_ENDPOINT)
    .setProject(APPWRITE_PROJECT_ID)
    .setKey(APPWRITE_API_KEY);

const databases = new Databases(client);

// ─── Constants ────────────────────────────────────────────────────────────────

const COLLECTIONS = {
    BUS_STOPS: 'bus_stops',
    BUS_ROUTES: 'bus_routes',
    ROUTE_STOPS: 'route_stops',
    BUSES: 'buses',
    DRIVERS: 'drivers',
    BUS_POSITIONS: 'bus_positions',
    SCHEDULES: 'schedules'
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getOrCreateCollection(name, id = name) {
    try {
        await databases.getCollection(APPWRITE_DATABASE_ID, id);
        console.log(`Collection ${name} (${id}) already exists.`);
        return id;
    } catch (e) {
        if (e.code === 404) {
            console.log(`Creating collection ${name} (${id})...`);
            await databases.createCollection(APPWRITE_DATABASE_ID, id, name);
            return id;
        }
        throw e;
    }
}

async function createAttributeSafely(id, createFn) {
    try {
        await createFn();
    } catch (e) {
        // 409 means attribute already exists or is being created
        if (e.code !== 409) {
            console.error(`Error creating attribute for ${id}:`, e.message);
        }
    }
}

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function createAttributes() {
    console.log("Setting up attributes (this may take a moment)...");

    // BUS_STOPS
    await createAttributeSafely(COLLECTIONS.BUS_STOPS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, 'code', 50, false));
    await createAttributeSafely(COLLECTIONS.BUS_STOPS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, 'name', 255, true));
    await createAttributeSafely(COLLECTIONS.BUS_STOPS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, 'latitude', true));
    await createAttributeSafely(COLLECTIONS.BUS_STOPS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_STOPS, 'longitude', true));

    // BUS_ROUTES
    await createAttributeSafely(COLLECTIONS.BUS_ROUTES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, 'shortName', 255, true));
    await createAttributeSafely(COLLECTIONS.BUS_ROUTES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, 'longName', 255, true));
    await createAttributeSafely(COLLECTIONS.BUS_ROUTES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, 'color', 50, true));
    await createAttributeSafely(COLLECTIONS.BUS_ROUTES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, 'textColor', 50, true));
    await createAttributeSafely(COLLECTIONS.BUS_ROUTES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_ROUTES, 'transport', 50, false));

    // ROUTE_STOPS
    await createAttributeSafely(COLLECTIONS.ROUTE_STOPS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.ROUTE_STOPS, 'routeId', 50, true));
    await createAttributeSafely(COLLECTIONS.ROUTE_STOPS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.ROUTE_STOPS, 'stopId', 50, true));
    await createAttributeSafely(COLLECTIONS.ROUTE_STOPS, () => databases.createIntegerAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.ROUTE_STOPS, 'stopOrder', true));

    // BUSES
    await createAttributeSafely(COLLECTIONS.BUSES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES, 'plateNumber', 100, true));
    await createAttributeSafely(COLLECTIONS.BUSES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES, 'model', 100, false));
    await createAttributeSafely(COLLECTIONS.BUSES, () => databases.createIntegerAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES, 'capacity', true));
    await createAttributeSafely(COLLECTIONS.BUSES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUSES, 'assignedRouteId', 50, false));

    // DRIVERS
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'name', 255, true));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'email', 255, true));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'licenseNumber', 100, true));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'phoneNumber', 50, false));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'assignedBusId', 50, false));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'status', 50, true));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'hireDate', 50, true));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'lastLatitude', false));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'lastLongitude', false));
    await createAttributeSafely(COLLECTIONS.DRIVERS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.DRIVERS, 'lastLocationAt', 50, false));

    // BUS_POSITIONS
    await createAttributeSafely(COLLECTIONS.BUS_POSITIONS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, 'busId', 50, true));
    await createAttributeSafely(COLLECTIONS.BUS_POSITIONS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, 'latitude', true));
    await createAttributeSafely(COLLECTIONS.BUS_POSITIONS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, 'longitude', true));
    await createAttributeSafely(COLLECTIONS.BUS_POSITIONS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, 'speed', true));
    await createAttributeSafely(COLLECTIONS.BUS_POSITIONS, () => databases.createFloatAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, 'heading', true));
    await createAttributeSafely(COLLECTIONS.BUS_POSITIONS, () => databases.createIntegerAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, 'occupancy', true));
    await createAttributeSafely(COLLECTIONS.BUS_POSITIONS, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, 'updatedAt', 50, true));

    // SCHEDULES
    await createAttributeSafely(COLLECTIONS.SCHEDULES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES, 'routeId', 50, true));
    await createAttributeSafely(COLLECTIONS.SCHEDULES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES, 'departureTime', 50, true));
    await createAttributeSafely(COLLECTIONS.SCHEDULES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES, 'arrivalTime', 50, true));
    await createAttributeSafely(COLLECTIONS.SCHEDULES, () => databases.createStringAttribute(APPWRITE_DATABASE_ID, COLLECTIONS.SCHEDULES, 'days', 1000, true));

    // Wait for attributes to be ready (Appwrite needs time to provision them)
    console.log("Waiting for attributes to be available (10s)...");
    await sleep(10000);
}

// ─── Data Seeding ─────────────────────────────────────────────────────────────

const TRANSPORT_COLORS = {
  bus:            { color: '3b82f6', textColor: 'ffffff' }, // blue
  microbus:       { color: 'f97316', textColor: 'ffffff' }, // orange
  tempo:          { color: '22c55e', textColor: 'ffffff' }, // green
  'bus;microbus': { color: '8b5cf6', textColor: 'ffffff' }, // violet
  'microbus;tempo':{ color: '14b8a6',textColor: 'ffffff' }, // teal
  micro:          { color: 'f59e0b', textColor: 'ffffff' }, // amber  (handles 'Micro')
  foot:           { color: '6b7280', textColor: 'ffffff' }, // gray
};
const DEFAULT_COLOR = { color: 'ef4444', textColor: 'ffffff' };

function routeColor(transport) {
  if (!transport) return DEFAULT_COLOR;
  return TRANSPORT_COLORS[transport.toLowerCase()] ?? DEFAULT_COLOR;
}

function parseXML() {
  const xmlPath = path.join(__dirname, '..', 'bato', 'yatayat_routes_with_stops.xml');
  const xml = fs.readFileSync(xmlPath, 'utf8');

  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: '',
    isArray: (name) => name === 'route' || name === 'stop',
  });

  const doc  = parser.parse(xml);
  const root = doc.yatayatRoutes;

  const routes = (root.route ?? []).map(r => ({
    id:        String(r.id),
    name:      r.name   ?? '',
    ref:       r.ref    ?? '',
    transport: r.transport ?? '',
    stops: (r.stop ?? []).map(s => ({
      id:       String(s.id),
      name:     s.name ?? '',
      lat:      parseFloat(s.lat),
      lon:      parseFloat(s.lon),
      sequence: parseInt(s.sequence, 10),
    })),
  }));

  return routes;
}

async function bulkInsert(collectionId, documents, mapFn) {
    console.log(`Inserting ${documents.length} docs into ${collectionId}...`);
    let success = 0;
    for (const doc of documents) {
        try {
            await databases.createDocument(APPWRITE_DATABASE_ID, collectionId, doc.id || ID.unique(), mapFn(doc));
            success++;
            if (success % 50 === 0) console.log(`  ...inserted ${success}`);
        } catch (e) {
             if (e.code === 409) {
                 // Document exists, ignore
             } else {
                 console.error(`Failed to insert document into ${collectionId}:`, e.message);
             }
        }
    }
    console.log(`Done inserting into ${collectionId}. Successful: ${success}`);
}

async function seedData() {
    const routes = parseXML();
    console.log(`✔ Parsed ${routes.length} routes from XML.`);

    // 1. Bus Stops
    const stopMap = new Map();
    for (const route of routes) {
      for (const stop of route.stops) {
        if (!stopMap.has(stop.id)) {
          stopMap.set(stop.id, stop);
        }
      }
    }
    console.log(`✔ ${stopMap.size} unique stops found.`);
    const stopArr = Array.from(stopMap.values());
    
    await bulkInsert(COLLECTIONS.BUS_STOPS, stopArr, s => ({
        name: s.name || 'Unknown',
        latitude: s.lat,
        longitude: s.lon,
        code: null
    }));

    // 2. Bus Routes
    await bulkInsert(COLLECTIONS.BUS_ROUTES, routes, r => {
        const { color, textColor } = routeColor(r.transport);
        const shortName = r.ref ? String(r.ref).slice(0, 20) : r.name.slice(0, 20);
        return {
            shortName,
            longName: r.name,
            color,
            textColor,
            transport: r.transport || null
        };
    });

    // 3. Route Stops
    const allRouteStops = routes.flatMap(route =>
      route.stops.map(stop => ({
          routeId: route.id,
          stopId: stop.id,
          stopOrder: stop.sequence
      }))
    );
    await bulkInsert(COLLECTIONS.ROUTE_STOPS, allRouteStops, rs => rs);

    // 4. Sample Buses
    const MODELS = [
      'Tata Starbus', 'Ashok Leyland', 'Tata Magic', 'Yutong City Bus',
      'Higer Bus', 'Tata Winger', 'Mahindra Maxximo', 'Safa Tempo',
    ];
    const CAPACITIES = { bus: 40, microbus: 15, tempo: 12, micro: 15, foot: 20 };
    const buses = routes.slice(0, 20).map((route, i) => {
      const cap = CAPACITIES[route.transport?.toLowerCase()] ?? 40;
      return {
        id: `b${i + 1}`,
        plateNumber: `BA ${i + 1} KHA ${1000 + i}`,
        model: MODELS[i % MODELS.length],
        capacity: cap,
        assignedRouteId: route.id,
      };
    });
    await bulkInsert(COLLECTIONS.BUSES, buses, b => {
        const { id, ...data } = b;
        return data;
    });

    // 5. Sample Drivers
    const DRIVER_NAMES = [
      'Bikash Tamang', 'Sita Rai', 'Ramesh Shrestha', 'Puja Maharjan',
      'Suresh Gurung', 'Anita Thapa', 'Deepak Karki', 'Mina Lama',
      'Roshan Bajracharya', 'Kabita Magar',
    ];
    const drivers = buses.slice(0, 10).map((b, i) => ({
      id: `d${i + 1}`,
      name: DRIVER_NAMES[i],
      email: `driver${i + 1}@yatayat.np`,
      licenseNumber: `KTM-DL-${String(i + 1).padStart(3, '0')}`,
      phoneNumber: `984100000${i + 1}`,
      assignedBusId: b.id,
      status: 'active',
      hireDate: '2023-01-01'
    }));
    await bulkInsert(COLLECTIONS.DRIVERS, drivers, d => {
        const { id, ...data } = d;
        return data;
    });

    // 6. Bus Positions
    const positions = buses.map(b => {
      const route = routes.find(r => r.id === b.assignedRouteId);
      if (!route || !route.stops.length) return null;
      const firstStop = route.stops[0];
      return {
          id: b.id,
          busId: b.id,
          latitude: firstStop.lat,
          longitude: firstStop.lon,
          speed: 0.0,
          heading: 0.0,
          occupancy: 0,
          updatedAt: new Date().toISOString()
      };
    }).filter(Boolean);
    
    // Check and update if positions already exist or insert them
    for(const pos of positions) {
        try {
            await databases.createDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, pos.id, {
                busId: pos.busId,
                latitude: pos.latitude,
                longitude: pos.longitude,
                speed: pos.speed,
                heading: pos.heading,
                occupancy: pos.occupancy,
                updatedAt: pos.updatedAt
            });
        } catch (e) {
            if (e.code === 409) {
                 await databases.updateDocument(APPWRITE_DATABASE_ID, COLLECTIONS.BUS_POSITIONS, pos.id, {
                    latitude: pos.latitude,
                    longitude: pos.longitude,
                    speed: pos.speed,
                    heading: pos.heading,
                    occupancy: pos.occupancy,
                    updatedAt: pos.updatedAt
                });
            } else {
                console.error("Failed to insert/update position:", e.message);
            }
        }
    }

    // 7. Schedules
    const schedules = [];
    routes.slice(0, 10).forEach(route => {
      schedules.push(
        { routeId: route.id, departureTime: '06:00', arrivalTime: '07:30', days: JSON.stringify(['Mon','Tue','Wed','Thu','Fri','Sat']) },
        { routeId: route.id, departureTime: '08:00', arrivalTime: '09:30', days: JSON.stringify(['Mon','Tue','Wed','Thu','Fri']) },
        { routeId: route.id, departureTime: '17:00', arrivalTime: '18:30', days: JSON.stringify(['Mon','Tue','Wed','Thu','Fri']) },
      );
    });
    await bulkInsert(COLLECTIONS.SCHEDULES, schedules, s => s);

    console.log("Seed complete!");
}

async function main() {
    try {
        console.log("Setting up Appwrite Database...");
        
        // Ensure Database exists (usually created from console, but let's be safe if it doesn't)
        try {
            await databases.get(APPWRITE_DATABASE_ID);
        } catch(e) {
            if (e.code === 404) {
                 console.log("Creating database...");
                 await databases.create(APPWRITE_DATABASE_ID, 'bato-mandu');
            } else {
                throw e;
            }
        }

        for (const key in COLLECTIONS) {
            await getOrCreateCollection(COLLECTIONS[key], COLLECTIONS[key]);
        }

        await createAttributes();
        await seedData();
        
        console.log("✅ Appwrite setup and seeding finished successfully!");
    } catch (e) {
        console.error("❌ Setup failed:", e);
    }
}

main();
