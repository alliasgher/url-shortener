export const config = {
  port: parseInt(process.env.PORT || "3001", 10),
  databaseUrl: process.env.DATABASE_URL || "",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
  baseUrl: process.env.BASE_URL || "http://localhost:3001",
};

if (!config.databaseUrl) {
  console.error("DATABASE_URL environment variable is required");
  process.exit(1);
}
