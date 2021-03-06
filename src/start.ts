import { DawApiServer } from './DawApi/DawApiServer';

// Start the server or run tests
if (process.argv[2] !== 'test') {
    const server = new DawApiServer();
    console.log(process.env.PORT);
    server.start(parseInt(process.env.PORT as string) || 3000);
}
