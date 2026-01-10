import 'dotenv/config';

export default {
  schema: 'prisma/schema.prisma',
  datasource: {
    url:
      process.env.DATABASE_URL ||
      'postgresql://portfolio:portfolio_dev_password@localhost:5432/portfolio?schema=public',
  },
};
