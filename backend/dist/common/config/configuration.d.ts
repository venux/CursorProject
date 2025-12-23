declare const _default: () => {
    env: string;
    port: number;
    mongoUri: string;
    redisUri: string;
    keycloak: {
        issuer: string;
        clientId: string;
        clientSecret: string;
    };
};
export default _default;
