import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Return basic health info
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    domain: req.headers.host,
    userAgent: req.headers['user-agent'],
    environment: process.env.NODE_ENV || 'development'
  });
} 