import dotenv from 'dotenv';
dotenv.config();

export const ENV = {
  dev: {
    baseURL: process.env.BASE_URL || 'https://remix-1--soselia.replit.app',
  },
  prod: {
    baseURL: process.env.BASE_URL || 'https://remix-1--soselia.replit.app',
  },
};

// default to dev if ENV not set
export const CURRENT_ENV = process.env.ENV || 'dev';

export const config = ENV[CURRENT_ENV as keyof typeof ENV];