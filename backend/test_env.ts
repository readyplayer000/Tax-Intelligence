import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

console.log("Current directory:", process.cwd());
const envPath = path.resolve(process.cwd(), '../.env');
console.log("Looking for .env at:", envPath);
console.log("Exists?", fs.existsSync(envPath));

dotenv.config({ path: envPath });
console.log("GOOGLE_API_KEY:", process.env.GOOGLE_API_KEY ? "Found" : "Not Found");
console.log("JWT_SECRET:", process.env.JWT_SECRET ? "Found" : "Not Found");
