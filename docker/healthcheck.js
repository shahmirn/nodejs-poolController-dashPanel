const fs = require("fs");
const http = require("http");

const CONFIG_FILE = "/app/config.json";
const DEFAULT_PORT = 5150;
const HEALTH_PATH = "/config/appVersion?health";

let port = DEFAULT_PORT;

try {
    const config = JSON.parse(fs.readFileSync(CONFIG_FILE, "utf8"));

    port = config.web?.servers?.http?.port ?? DEFAULT_PORT;
} catch {
    // Use the default port if the config is unavailable or invalid.
}

const request = http.get(
    {
        host: "127.0.0.1",
        port,
        path: HEALTH_PATH,
        timeout: 5000,
    },
    (response) => {
        response.resume();

        if (response.statusCode >= 200 && response.statusCode < 300) {
            process.exit(0);
        }

        process.exit(1);
    }
);

request.on("error", () => {
    process.exit(1);
});

request.on("timeout", () => {
    request.destroy();
    process.exit(1);
});
