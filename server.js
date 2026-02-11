const WebSocket = require("ws");

const PORT = process.env.PORT || 10000;
const wss = new WebSocket.Server({ port: PORT });

let players = [];

wss.on("connection", (ws) => {
    console.log("Player connected");

    if (players.length >= 2) {
        ws.send("full");
        ws.close();
        return;
    }

    players.push(ws);
    const playerID = players.length; // 1 or 2
    ws.send("player|" + playerID);

    ws.on("message", (message) => {
        // Forward message to other player
        players.forEach(player => {
            if (player !== ws && player.readyState === WebSocket.OPEN) {
                player.send(message.toString());
            }
        });
    });

    ws.on("close", () => {
        players = players.filter(player => player !== ws);
        console.log("Player disconnected");
    });
});

console.log("Server running on port " + PORT);