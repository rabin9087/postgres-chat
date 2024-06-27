"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const socket_1 = require("./src/utils/socket");
const cors_1 = __importDefault(require("cors"));
const port = 8080;
const app = (0, express_1.default)();
exports.server = http_1.default.createServer(app);
(0, socket_1.connectSocket)();
app.use((0, cors_1.default)({
    origin: [process.env.WEB_DOMAIN],
    methods: ["GET", "PUT", "PATCH", "DELETE", "POST"],
    allowedHeaders: ["Authorization", "refreshjwt", "Content-Type"],
    credentials: true,
}));
const ip = process.env.ENVIRONMENT === "Development" ? "192.168.20.8" : "0.0.0.0";
app.use(express_1.default.json());
const user_router_1 = __importDefault(require("./src/router/user.router"));
const friendRequest_router_1 = __importDefault(require("./src/router/friendRequest.router"));
const chatRoom_router_1 = __importDefault(require("./src/router/chatRoom.router"));
const message_router_1 = __importDefault(require("./src/router/message.router"));
const middleware_1 = require("./src/middleware");
app.use("/api/v1/user", user_router_1.default);
app.use("/api/v1/friend", middleware_1.auth, friendRequest_router_1.default);
app.use("/api/v1/room", middleware_1.auth, chatRoom_router_1.default);
app.use("/api/v1/message", middleware_1.auth, message_router_1.default);
app.use((error, req, res, next) => {
    console.log(error);
    if (error.message.includes(`"password" with value`)) {
        error.message = "Password must match the include special characters";
    }
    const code = error.statusCode || 500;
    const msg = error.message || "Internal Server Error.";
    return res.status(code).json({
        status: false,
        message: msg,
    });
});
app.get("/", async (req, res) => {
    req.setTimeout(100);
    res.json({
        status: "success",
        message: "Welcome to the chat application",
    });
});
exports.server.listen(port, ip, () => {
    console.log(`Server is running on http://${ip}:${port}`);
});
