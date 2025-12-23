export default () => ({
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000", 10),
  mongoUri: process.env.MONGO_URI || "mongodb://localhost:27017/cs-platform",
  redisUri: process.env.REDIS_URI || "redis://localhost:6379",
  keycloak: {
    issuer: process.env.KEYCLOAK_ISSUER || "http://localhost:8080/realms/customer-support",
    clientId: process.env.KEYCLOAK_CLIENT_ID || "cs-frontend",
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "change-me"
  }
});

