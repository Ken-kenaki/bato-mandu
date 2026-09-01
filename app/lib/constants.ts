export const APPWRITE_ENDPOINT = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT || '';
export const APPWRITE_PROJECT_ID = process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID || '';
export const APPWRITE_DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID || '';

export const COLLECTIONS = {
    BUS_STOPS: 'bus_stops',
    BUS_ROUTES: 'bus_routes',
    ROUTE_STOPS: 'route_stops',
    BUSES: 'buses',
    DRIVERS: 'drivers',
    BUS_POSITIONS: 'bus_positions',
    SCHEDULES: 'schedules'
};
