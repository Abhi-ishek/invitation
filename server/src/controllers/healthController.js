import { getDBStatus } from '../config/db.js';
import { ApiResponse } from '../utils/apiResponse.js';

export const getHealth = async (req, res) => {
  const uptimeSeconds = Math.floor(process.uptime());
  const hours = Math.floor(uptimeSeconds / 3600);
  const minutes = Math.floor((uptimeSeconds % 3600) / 60);
  const seconds = uptimeSeconds % 60;

  const healthData = {
    service: 'Wedding Wishcraft API',
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: `${hours}h ${minutes}m ${seconds}s`,
    environment: process.env.NODE_ENV || 'development',
    database: {
      status: getDBStatus(),
    }, 
    version: '1.0.0',
    memoryUsage: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)} MB`,
    },
  };

  res.status(200).json(new ApiResponse(200, healthData, 'API is operational and healthy'));
};
