import server from "./server";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.SERVER_PORT;

server.listen(PORT, () => console.log(`Tracker api listening on port ${PORT}`));
