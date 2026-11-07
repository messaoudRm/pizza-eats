import { buildApp } from "./app";

const start = async () => {
    const app = await buildApp();

    try {
        await app.listen({
            port: Number(process.env.PORT) || 3000,
            host: "0.0.0.0",
        });
    } catch (error) {
        app.log.error(error);
        process.exit(1);
    }
};

void start();