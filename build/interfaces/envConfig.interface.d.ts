export interface IEnvironmentConfiguration {
    NODE_ENV: string;
    APP_NAME: string;
    PORT: number;
    BASE_URL: string;
    CLIENT_URL: string;
    MONGODB_URL: string;
    DB_NAME: string;
    ACCESS_TOKEN_SECRET: string;
    ACCESS_TOKEN_EXPIRES_IN: string;
    REFRESH_TOKEN_SECRET: string;
    REFRESH_TOKEN_EXPIRES_IN: string;
    FORGET_PASSWORD_SECRET: string;
    FORGET_PASSWORD_EXPIRES_IN: string;
    VERIFICATION_TOKEN_SECRET: string;
    VERIFICATION_TOKEN_EXPIRES_IN: string;
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    CALLBACK_URL: string;
    GOOGLE_REFRESH_TOKEN: string;
    GOOGLE_ACCESS_TOKEN: string;
    CLOUD_NAME: string;
    CLOUD_API_KEY: string;
    CLOUD_API_SECRET: string;
    DEFAULT_PER_PAGE: number;
    SALT_ROUNDS: number;
}
