export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || 'https://sgp.cloud.appwrite.io/v1';
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '69bcb4cc0018212a93a4';
export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '6a93ab120004ff62b19e';

export const COLLECTIONS = {
    BUS_STOPS: 'bus_stops',
    BUS_ROUTES: 'bus_routes',
    ROUTE_STOPS: 'route_stops',
    BUSES: 'buses',
    DRIVERS: 'drivers',
    BUS_POSITIONS: 'bus_positions',
    SCHEDULES: 'schedules'
};
