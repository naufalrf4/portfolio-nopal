# Deployment Guide

This document provides comprehensive deployment instructions for the NaufalRF Portfolio Ecosystem across multiple platforms.

## Table of Contents

- [Environment Variables](#environment-variables)
- [Heroku Deployment](#heroku-deployment)
- [Google Cloud App Engine](#google-cloud-app-engine)
- [AWS ECS (Fargate)](#aws-ecs-fargate)
- [AWS Elastic Beanstalk](#aws-elastic-beanstalk)
- [VPS Deployment (Docker Compose)](#vps-deployment-docker-compose)
- [Database Setup](#database-setup)
- [Post-Deployment Verification](#post-deployment-verification)

---

## Environment Variables

### Required for All Platforms

#### Admin App

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/database
DIRECT_URL=postgresql://user:password@host:5432/database

# Authentication
NEXTAUTH_SECRET=<generate with: openssl rand -base64 32>
NEXTAUTH_URL=https://admin.yourdomain.com

# Admin Configuration
ADMIN_EMAILS=admin@example.com,admin2@example.com
ADMIN_SERVICE_TOKEN=<generate with: openssl rand -hex 32>

# Cloudflare R2 Storage
R2_ENDPOINT=https://[account-id].r2.cloudflarestorage.com
R2_ACCESS_KEY_ID=your_r2_access_key
R2_SECRET_ACCESS_KEY=your_r2_secret_key
R2_BUCKET_NAME=naufalrf-portfolio
R2_PUBLIC_URL=https://pub-[hash].r2.dev/naufalrf-portfolio

# Email Service (Resend)
RESEND_API_KEY=re_xxxxxxxxxxxxx

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA_your_site_key
TURNSTILE_SECRET_KEY=0x4AAAAAAA_your_secret_key

# Mapbox (Optional)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1...

# Google Analytics (Optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
GA_PROPERTY_ID=properties/123456789
GA_SERVICE_ACCOUNT={"type":"service_account",...}
```

#### Public App

```bash
# API Configuration
NEXT_PUBLIC_ADMIN_API_URL=https://admin.yourdomain.com/api
ADMIN_API_URL=https://admin.yourdomain.com/api

# Authentication
NEXTAUTH_SECRET=<same as admin app>
NEXTAUTH_URL=https://yourdomain.com

# Google OAuth
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret

# Cloudflare Turnstile
NEXT_PUBLIC_TURNSTILE_SITE_KEY=0x4AAAAAAA_your_site_key

# Google Analytics (Optional)
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

#### Links App

```bash
NEXT_PUBLIC_ADMIN_API_URL=https://admin.yourdomain.com
```

#### NGL App

```bash
NEXT_PUBLIC_API_URL=https://admin.yourdomain.com
```

---

## Heroku Deployment

### Prerequisites

- Heroku CLI installed
- Heroku account with billing enabled
- PostgreSQL add-on or external database

### Steps

1. **Create Heroku App**

```bash
heroku create naufalrf-portfolio-admin
heroku create naufalrf-portfolio-public
heroku create naufalrf-portfolio-links
heroku create naufalrf-portfolio-ngl
```

2. **Add PostgreSQL Database**

```bash
heroku addons:create heroku-postgresql:standard-0 -a naufalrf-portfolio-admin
```

3. **Set Environment Variables**

```bash
# Admin App
heroku config:set -a naufalrf-portfolio-admin \
  NODE_ENV=production \
  NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  NEXTAUTH_URL=https://naufalrf-portfolio-admin.herokuapp.com \
  ADMIN_EMAILS=your@email.com \
  R2_ENDPOINT=your_r2_endpoint \
  R2_ACCESS_KEY_ID=your_key \
  R2_SECRET_ACCESS_KEY=your_secret \
  R2_BUCKET_NAME=your_bucket \
  R2_PUBLIC_URL=your_public_url

# Public App
heroku config:set -a naufalrf-portfolio-public \
  NODE_ENV=production \
  NEXT_PUBLIC_ADMIN_API_URL=https://naufalrf-portfolio-admin.herokuapp.com/api \
  NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  NEXTAUTH_URL=https://naufalrf-portfolio-public.herokuapp.com \
  GOOGLE_CLIENT_ID=your_client_id \
  GOOGLE_CLIENT_SECRET=your_client_secret
```

4. **Deploy**

```bash
# Admin App
git subtree push --prefix apps/admin heroku-admin main

# Or use buildpacks for monorepo
heroku buildpacks:add -a naufalrf-portfolio-admin heroku/nodejs
heroku config:set -a naufalrf-portfolio-admin PROJECT_PATH=apps/admin
git push heroku-admin main
```

5. **Run Database Migrations**

```bash
heroku run -a naufalrf-portfolio-admin "cd apps/admin && pnpm db:migrate"
```

---

## Google Cloud App Engine

### Prerequisites

- Google Cloud SDK installed
- Google Cloud project created
- Cloud SQL PostgreSQL instance

### Steps

1. **Create Cloud SQL Instance**

```bash
gcloud sql instances create portfolio-db \
  --database-version=POSTGRES_16 \
  --tier=db-f1-micro \
  --region=us-central1
```

2. **Create Database**

```bash
gcloud sql databases create portfolio --instance=portfolio-db
```

3. **Update app.yaml with Environment Variables**

```yaml
# app.yaml
runtime: nodejs22
instance_class: F2

env_variables:
  NODE_ENV: 'production'
  PORT: '8080'
  DATABASE_URL: 'postgresql://user:pass@/portfolio?host=/cloudsql/PROJECT:REGION:INSTANCE'
  NEXTAUTH_SECRET: 'your_secret'
  NEXTAUTH_URL: 'https://PROJECT.appspot.com'
  # Add all other required variables
```

4. **Deploy**

```bash
gcloud app deploy app.yaml
```

5. **Run Migrations**

```bash
gcloud app deploy --no-promote
gcloud app instances ssh --service=default --version=VERSION
cd apps/admin && pnpm db:migrate
```

---

## AWS ECS (Fargate)

### Prerequisites

- AWS CLI configured
- ECR repositories created
- RDS PostgreSQL instance
- Application Load Balancer configured

### Steps

1. **Create ECR Repositories**

```bash
aws ecr create-repository --repository-name naufalrf-admin
aws ecr create-repository --repository-name naufalrf-public
aws ecr create-repository --repository-name naufalrf-links
aws ecr create-repository --repository-name naufalrf-ngl
```

2. **Build and Push Docker Images**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push admin
docker build -f Dockerfile.admin -t naufalrf-admin .
docker tag naufalrf-admin:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-admin:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-admin:latest

# Repeat for public, links, ngl
```

3. **Create Secrets in AWS Secrets Manager**

```bash
aws secretsmanager create-secret --name portfolio/database-url --secret-string "postgresql://..."
aws secretsmanager create-secret --name portfolio/nextauth-secret --secret-string "..."
# Create all required secrets
```

4. **Update Task Definition**

- Edit `aws-ecs-task-definition.json`
- Replace ACCOUNT_ID and REGION placeholders
- Update secret ARNs

5. **Register Task Definition**

```bash
aws ecs register-task-definition --cli-input-json file://aws-ecs-task-definition.json
```

6. **Create ECS Service**

```bash
aws ecs create-service \
  --cluster portfolio-cluster \
  --service-name portfolio-service \
  --task-definition naufalrf-portfolio \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:...,containerName=admin-app,containerPort=3001"
```

7. **Run Migrations**

```bash
aws ecs run-task \
  --cluster portfolio-cluster \
  --task-definition naufalrf-portfolio \
  --launch-type FARGATE \
  --overrides '{"containerOverrides":[{"name":"admin-app","command":["sh","-c","cd apps/admin && pnpm db:migrate"]}]}'
```

---

## AWS Elastic Beanstalk

### Prerequisites

- AWS CLI and EB CLI installed
- RDS PostgreSQL instance

### Steps

1. **Initialize Elastic Beanstalk**

```bash
eb init -p node.js-22 naufalrf-portfolio --region us-east-1
```

2. **Create Environment**

```bash
eb create production-env \
  --instance-type t3.small \
  --database.engine postgres \
  --database.version 16
```

3. **Set Environment Variables**

```bash
eb setenv \
  NODE_ENV=production \
  DATABASE_URL=postgresql://... \
  NEXTAUTH_SECRET=... \
  NEXTAUTH_URL=... \
  # Add all required variables
```

4. **Deploy**

```bash
eb deploy
```

5. **Run Migrations**

```bash
eb ssh
cd /var/app/current
pnpm --filter admin db:migrate
```

---

## VPS Deployment (Docker Compose)

### Prerequisites

- VPS with Docker and Docker Compose installed
- Domain names configured
- SSL certificates (Let's Encrypt recommended)

### Steps

1. **Clone Repository**

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Create Production Environment File**

```bash
cp .env.example .env.production
# Edit .env.production with production values
```

3. **Build and Start Services**

```bash
docker-compose --env-file .env.production up -d --build
```

4. **Run Database Migrations**

```bash
docker exec -it portfolio-admin sh
cd apps/admin
pnpm db:migrate
exit
```

5. **Configure Reverse Proxy (Nginx)**

```nginx
# /etc/nginx/sites-available/portfolio
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Repeat for links.yourdomain.com (3002) and ngl.yourdomain.com (3003)
```

6. **Enable SSL with Certbot**

```bash
sudo certbot --nginx -d yourdomain.com -d admin.yourdomain.com -d links.yourdomain.com -d ngl.yourdomain.com
```

7. **Set Up Auto-Renewal**

```bash
sudo crontab -e
# Add: 0 0 * * * certbot renew --quiet
```

---

## Database Setup

### PostgreSQL Configuration

1. **Create Database**

```sql
CREATE DATABASE portfolio;
CREATE USER portfolio_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;
```

2. **Connection String Format**

```
postgresql://username:password@host:port/database?sslmode=require
```

3. **For Neon (Serverless)**

```
postgresql://username:password@host.neon.tech/database?sslmode=require
```

### Running Migrations

```bash
# Local
pnpm --filter admin db:migrate

# Docker
docker exec -it portfolio-admin pnpm --filter admin db:migrate

# Heroku
heroku run -a app-name "cd apps/admin && pnpm db:migrate"
```

---

## Post-Deployment Verification

### Health Checks

1. **Admin App**

```bash
curl https://admin.yourdomain.com/api/health
# Expected: {"status":"ok"}
```

2. **Public App**

```bash
curl https://yourdomain.com/api/health
# Expected: {"status":"ok"}
```

3. **Database Connection**

```bash
curl https://admin.yourdomain.com/api/v1/public/about
# Expected: JSON response with about data
```

### Monitoring

1. **Check Logs**

```bash
# Docker
docker logs portfolio-admin
docker logs portfolio-public

# Heroku
heroku logs --tail -a app-name

# AWS ECS
aws logs tail /ecs/naufalrf-portfolio --follow
```

2. **Performance Monitoring**

- Set up application monitoring (New Relic, Datadog, etc.)
- Configure error tracking (Sentry)
- Enable uptime monitoring (UptimeRobot, Pingdom)

### Security Checklist

- [ ] All environment variables are set correctly
- [ ] Database uses SSL connections
- [ ] NEXTAUTH_SECRET is unique and secure
- [ ] Admin emails are configured
- [ ] Rate limiting is enabled
- [ ] CORS is properly configured
- [ ] SSL certificates are valid
- [ ] Firewall rules are configured
- [ ] Backup strategy is in place

---

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Verify DATABASE_URL format
   - Check firewall rules
   - Ensure SSL mode is correct

2. **Authentication Not Working**
   - Verify NEXTAUTH_SECRET matches across apps
   - Check NEXTAUTH_URL is correct
   - Verify Google OAuth credentials

3. **Build Failures**
   - Check Node.js version (requires >=22.0.0)
   - Verify pnpm version (>=9.0.0)
   - Clear build cache and retry

4. **API Calls Failing**
   - Verify NEXT_PUBLIC_ADMIN_API_URL is correct
   - Check CORS configuration
   - Verify admin app is running

### Getting Help

- Check application logs first
- Review environment variables
- Test API endpoints individually
- Verify database connectivity

---

## Rollback Procedures

### Heroku

```bash
heroku releases -a app-name
heroku rollback v123 -a app-name
```

### AWS ECS

```bash
aws ecs update-service --cluster portfolio-cluster --service portfolio-service --task-definition naufalrf-portfolio:PREVIOUS_VERSION
```

### Docker Compose

```bash
git checkout previous-commit
docker-compose down
docker-compose up -d --build
```

---

## Maintenance

### Regular Tasks

1. **Database Backups**
   - Set up automated daily backups
   - Test restore procedures monthly

2. **Dependency Updates**
   - Review and update dependencies monthly
   - Test in staging before production

3. **SSL Certificate Renewal**
   - Automated with Certbot
   - Verify renewal works

4. **Log Rotation**
   - Configure log rotation to prevent disk space issues
   - Archive old logs

5. **Security Updates**
   - Apply security patches promptly
   - Monitor security advisories

---

## Support

For deployment issues or questions:

- Review this documentation
- Check application logs
- Consult platform-specific documentation
- Contact system administrator
