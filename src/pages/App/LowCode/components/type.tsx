import { config } from 'ice';


// 获取schema的API
export const SCHEMA_API = config.SCHEMA_API ?? 'http://localhost:8112/backend/low-code/schema';
// page restAPI
export const REST_API = config.PAGE_API ?? 'http://localhost:8112/@robber/devPage';
// 本地PAGE_ID
export const LOCAL_PAGE_ID = 'local';

