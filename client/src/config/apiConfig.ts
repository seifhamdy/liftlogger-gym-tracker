type ApiUrls = {
    [key: string]: string;
  };

  const API_URLS: ApiUrls = {
    development: 'http://localhost:3000/api/v1',
    production: 'https://liftlogger-gym-tracker-app.vercel.app/api/v1',
  };

  export const getApiUrl = (): string => {
    const env = process.env.NODE_ENV || 'development';
    return API_URLS[env];
  };
