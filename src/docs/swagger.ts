import config from '@/config/config';
import swaggerJSDoc from 'swagger-jsdoc';

/**
 * @swagger
 *
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *     cookieAuth:
 *       type: apiKey
 *       in: cookie
 *       name: GlAuth
 */

export const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Analysis API',
      version: '0.1.0',
      description:
        'An api for analyzing verse lists and adding tags to denote special words, phrases, unique beginnings and endings, etc.',
      license: {
        name: 'MIT',
        url: 'https://spdx.org/licenses/MIT.html',
      },
    },
    servers: [
      {
        url: config.EXTERNAL_URL,
      },
    ],
  },
  apis: ['./src/**/*.ts', '../models/src/**/*.ts'],
};

export const swaggerConfig = swaggerJSDoc(options);
