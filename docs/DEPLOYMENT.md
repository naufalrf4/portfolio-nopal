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
- [Troubleshooting](#troubleshooting)
- [Rollback Procedures](#rollback-procedures)
- [Maintenance](#maintenance)

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
# For monorepo deployment, use buildpacks
heroku buildpacks:add -a naufalrf-portfolio-admin heroku/nodejs
heroku config:set -a naufalrf-portfolio-admin PROJECT_PATH=apps/admin

# Push to Heroku
git push heroku main

# Or use subtree for specific app
git subtree push --prefix apps/admin heroku-admin main
```

5. **Run Database Migrations**

```bash
heroku run -a naufalrf-portfolio-admin "cd apps/admin && pnpm db:migrate"
```

6. **Verify Deployment**

```bash
heroku open -a naufalrf-portfolio-admin
heroku logs --tail -a naufalrf-portfolio-admin
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
gcloud sql users create portfolio_user --instance=portfolio-db --password=secure_password
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
  ADMIN_EMAILS: 'admin@example.com'
  R2_ENDPOINT: 'your_r2_endpoint'
  R2_ACCESS_KEY_ID: 'your_key'
  R2_SECRET_ACCESS_KEY: 'your_secret'
  R2_BUCKET_NAME: 'your_bucket'
  R2_PUBLIC_URL: 'your_public_url'
```

4. **Deploy**

```bash
gcloud app deploy app.yaml
```

5. **Run Migrations**

```bash
# Deploy without promoting to test
gcloud app deploy --no-promote

# SSH into instance
gcloud app instances ssh --service=default --version=VERSION

# Run migrations
cd apps/admin && pnpm db:migrate
exit
```

6. **Verify Deployment**

```bash
gcloud app browse
gcloud app logs tail -s default
```

---

## AWS ECS (Fargate)

### Prerequisites

- AWS CLI configured
- ECR repositories created
- RDS PostgreSQL instance
- Application Load Balancer configured
- VPC with public/private subnets

### Steps

1. **Create ECR Repositories**

```bash
aws ecr create-repository --repository-name naufalrf-admin --region us-east-1
aws ecr create-repository --repository-name naufalrf-public --region us-east-1
aws ecr create-repository --repository-name naufalrf-links --region us-east-1
aws ecr create-repository --repository-name naufalrf-ngl --region us-east-1
```

2. **Build and Push Docker Images**

```bash
# Login to ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com

# Build and push admin
docker build -f Dockerfile.admin -t naufalrf-admin .
docker tag naufalrf-admin:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-admin:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-admin:latest

# Build and push public
docker build -f Dockerfile.public -t naufalrf-public .
docker tag naufalrf-public:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-public:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-public:latest

# Build and push links
docker build -f Dockerfile.links -t naufalrf-links .
docker tag naufalrf-links:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-links:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-links:latest

# Build and push ngl
docker build -f Dockerfile.ngl -t naufalrf-ngl .
docker tag naufalrf-ngl:latest ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-ngl:latest
docker push ACCOUNT_ID.dkr.ecr.us-east-1.amazonaws.com/naufalrf-ngl:latest
```

3. **Create Secrets in AWS Secrets Manager**

```bash
aws secretsmanager create-secret \
  --name portfolio/database-url \
  --secret-string "postgresql://user:pass@host:5432/portfolio?sslmode=require"

aws secretsmanager create-secret \
  --name portfolio/nextauth-secret \
  --secret-string "$(openssl rand -base64 32)"

aws secretsmanager create-secret \
  --name portfolio/nextauth-url \
  --secret-string "https://admin.yourdomain.com"

aws secretsmanager create-secret \
  --name portfolio/admin-emails \
  --secret-string "admin@example.com"

# Create all other required secrets
```

4. **Update Task Definition**

Edit `aws-ecs-task-definition.json`:

- Replace ACCOUNT_ID with your AWS account ID
- Replace REGION with your AWS region
- Update secret ARNs with actual values

5. **Register Task Definition**

```bash
aws ecs register-task-definition \
  --cli-input-json file://aws-ecs-task-definition.json
```

6. **Create ECS Cluster**

```bash
aws ecs create-cluster --cluster-name portfolio-cluster
```

7. **Create ECS Service**

```bash
aws ecs create-service \
  --cluster portfolio-cluster \
  --service-name portfolio-service \
  --task-definition naufalrf-portfolio \
  --desired-count 1 \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx,subnet-yyy],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --load-balancers "targetGroupArn=arn:aws:elasticloadbalancing:region:account:targetgroup/admin/xxx,containerName=admin-app,containerPort=3001"
```

8. **Run Migrations**

```bash
aws ecs run-task \
  --cluster portfolio-cluster \
  --task-definition naufalrf-portfolio \
  --launch-type FARGATE \
  --network-configuration "awsvpcConfiguration={subnets=[subnet-xxx],securityGroups=[sg-xxx],assignPublicIp=ENABLED}" \
  --overrides '{"containerOverrides":[{"name":"admin-app","command":["sh","-c","cd apps/admin && pnpm db:migrate"]}]}'
```

9. **Verify Deployment**

```bash
aws ecs describe-services --cluster portfolio-cluster --services portfolio-service
aws ecs list-tasks --cluster portfolio-cluster --service-name portfolio-service
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
  DATABASE_URL=postgresql://user:pass@host:5432/portfolio \
  NEXTAUTH_SECRET=$(openssl rand -base64 32) \
  NEXTAUTH_URL=https://your-app.elasticbeanstalk.com \
  ADMIN_EMAILS=admin@example.com \
  R2_ENDPOINT=your_endpoint \
  R2_ACCESS_KEY_ID=your_key \
  R2_SECRET_ACCESS_KEY=your_secret \
  R2_BUCKET_NAME=your_bucket \
  R2_PUBLIC_URL=your_url
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
exit
```

6. **Verify Deployment**

```bash
eb open
eb logs
```

---

## VPS Deployment (Docker Compose)

### Prerequisites

- VPS with Docker and Docker Compose installed (Ubuntu 22.04+ recommended)
- Domain names configured
- SSL certificates (Let's Encrypt recommended)
- Minimum 2GB RAM, 2 CPU cores

### Steps

1. **Clone Repository**

```bash
git clone https://github.com/yourusername/portfolio.git
cd portfolio
```

2. **Create Production Environment File**

```bash
cp .env.production.example .env.production

# Edit with your values
nano .env.production
```

3. **Build and Start Services**

```bash
# Build images
docker-compose --env-file .env.production build

# Start services
docker-compose --env-file .env.production up -d

# Check status
docker-compose ps
```

4. **Run Database Migrations**

```bash
# Access admin container
docker exec -it portfolio-admin sh

# Run migrations
cd apps/admin
pnpm db:migrate

# Exit container
exit
```

5. **Configure Reverse Proxy (Nginx)**

```bash
# Install Nginx
sudo apt update
sudo apt install nginx

# Create configuration
sudo nano /etc/nginx/sites-available/portfolio
```

Add the following configuration:

```nginx
# Admin App
server {
    listen 80;
    server_name admin.yourdomain.com;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Public App
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Links App
server {
    listen 80;
    server_name links.yourdomain.com;

    location / {
        proxy_pass http://localhost:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# NGL App
server {
    listen 80;
    server_name ngl.yourdomain.com;

    location / {
        proxy_pass http://localhost:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the configuration:

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/portfolio /etc/nginx/sites-enabled/

# Test configuration
sudo nginx -t

# Restart Nginx
sudo systemctl restart nginx
```

6. **Enable SSL with Certbot**

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificates
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com \
  -d admin.yourdomain.com -d links.yourdomain.com -d ngl.yourdomain.com

# Follow prompts to configure SSL
```

7. **Set Up Auto-Renewal**

```bash
# Test renewal
sudo certbot renew --dry-run

# Add cron job for auto-renewal
sudo crontab -e

# Add this line:
0 0 * * * certbot renew --quiet --post-hook "systemctl reload nginx"
```

8. **Configure Firewall**

```bash
# Allow SSH, HTTP, HTTPS
sudo ufw allow 22/tcp
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# Enable firewall
sudo ufw enable
```

9. **Set Up Docker Auto-Restart**

```bash
# Update docker-compose.yml to include restart policies
# All services should have: restart: unless-stopped
```

10. **Verify Deployment**

```bash
# Check all containers are running
docker-compose ps

# Check logs
docker-compose logs -f

# Test endpoints
curl https://yourdomain.com
curl https://admin.yourdomain.com/api/health
```

---

## Database Setup

### PostgreSQL Configuration

1. **Create Database**

```sql
CREATE DATABASE portfolio;
CREATE USER portfolio_user WITH PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE portfolio TO portfolio_user;

-- For PostgreSQL 15+
\c portfolio
GRANT ALL ON SCHEMA public TO portfolio_user;
```

2. **Connection String Format**

```
# Standard connection
postgresql://username:password@host:port/database?sslmode=require

# For Neon (Serverless with pooling)
postgresql://username:password@host.neon.tech/database?sslmode=require&pgbouncer=true

# For local development
postgresql://username:password@localhost:5432/database
```

3. **For Neon (Serverless)**

```bash
# Get connection string from Neon dashboard
# Use pooled connection for serverless environments
DATABASE_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require&pgbouncer=true

# Use direct connection for migrations
DIRECT_URL=postgresql://user:pass@host.neon.tech/db?sslmode=require
```

### Running Migrations

```bash
# Local
pnpm --filter admin db:migrate

# Docker
docker exec -it portfolio-admin pnpm --filter admin db:migrate

# Heroku
heroku run -a app-name "cd apps/admin && pnpm db:migrate"

# AWS ECS (one-time task)
aws ecs run-task --cluster portfolio-cluster --task-definition naufalrf-portfolio \
  --overrides '{"containerOverrides":[{"name":"admin-app","command":["sh","-c","cd apps/admin && pnpm db:migrate"]}]}'
```

### Database Backup

```bash
# Manual backup
pg_dump -h host -U user -d database > backup.sql

# Restore
psql -h host -U user -d database < backup.sql

# For Docker
docker exec portfolio-postgres pg_dump -U portfolio portfolio > backup.sql
docker exec -i portfolio-postgres psql -U portfolio portfolio < backup.sql
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

4. **All Public Endpoints**

```bash
# Projects
curl https://admin.yourdomain.com/api/v1/public/projects

# Blogs
curl https://admin.yourdomain.com/api/v1/public/blogs

# Profile Links
curl https://admin.yourdomain.com/api/v1/public/profile-links

# Guestbook
curl https://admin.yourdomain.com/api/v1/public/guestbook
```

### Monitoring

1. **Check Logs**

```bash
# Docker
docker logs portfolio-admin --tail 100 -f
docker logs portfolio-public --tail 100 -f

# Heroku
heroku logs --tail -a app-name

# AWS ECS
aws logs tail /ecs/naufalrf-portfolio --follow

# Google Cloud
gcloud app logs tail -s default
```

2. **Performance Monitoring**

Set up monitoring services:

- Application Performance Monitoring (APM): New Relic, Datadog, or Dynatrace
- Error Tracking: Sentry
- Uptime Monitoring: UptimeRobot, Pingdom, or StatusCake
- Log Aggregation: Logtail, Papertrail, or CloudWatch

3. **Resource Usage**

```bash
# Docker
docker stats

# Check disk space
df -h

# Check memory
free -h

# Check CPU
top
```

### Security Checklist

- [ ] All environment variables are set correctly
- [ ] Database uses SSL connections (`sslmode=require`)
- [ ] NEXTAUTH_SECRET is unique and secure (32+ characters)
- [ ] Admin emails are configured
- [ ] Rate limiting is enabled on write endpoints
- [ ] CORS is properly configured (only allowed origins)
- [ ] SSL certificates are valid and auto-renewing
- [ ] Firewall rules are configured (only necessary ports open)
- [ ] Backup strategy is in place (daily automated backups)
- [ ] Secrets are not committed to git
- [ ] Admin service token is secure
- [ ] Google OAuth credentials are correct
- [ ] Cloudflare Turnstile is configured
- [ ] R2 storage credentials are secure

### Performance Checklist

- [ ] Database indexes are created for frequently queried fields
- [ ] ISR (Incremental Static Regeneration) is configured
- [ ] CDN is configured for static assets
- [ ] Images are optimized
- [ ] Gzip/Brotli compression is enabled
- [ ] HTTP/2 is enabled
- [ ] Connection pooling is configured
- [ ] Caching headers are set correctly

---

## Troubleshooting

### Database Issues

#### 1. Database Connection Failed

**Symptoms:**

- Application crashes on startup
- Error: "Connection refused" or "Connection timeout"
- Error: "SSL connection required"

**Solutions:**

```bash
# Test database connection
psql "postgresql://user:password@host:5432/database?sslmode=require"

# Check if database is running (Docker)
docker ps | grep postgres

# Check database logs
docker logs portfolio-postgres

# Test from application container
docker exec -it portfolio-admin sh
psql $DATABASE_URL
```

**Common Fixes:**

- Verify DATABASE_URL format is correct (no typos in username, password, host)
- Check firewall rules allow connections from your IP/service
- Ensure SSL mode matches database requirements (`sslmode=require` for production)
- For Neon: Use connection pooling URL (`?pgbouncer=true`) for serverless
- Check if database user has proper permissions
- Verify database instance is running and accessible
- Check if connection limit is reached

#### 2. Migration Failures

**Symptoms:**

- Error: "Migration failed"
- Error: "Table already exists"
- Error: "Column does not exist"
- Error: "Relation does not exist"

**Solutions:**

```bash
# Check migration status
pnpm --filter admin db:migrate  # Check migration status

# View migration history
pnpm --filter admin db:migrate  # View migration history

# Reset database (CAUTION: Development only - deletes all data)
pnpm --filter admin db:push  # Reset and push schema

# Apply pending migrations
pnpm --filter admin db:migrate

# Generate Drizzle client
pnpm --filter admin db:generate

# Push schema without migrations (dev only)
pnpm --filter admin db:push
```

**Common Fixes:**

- Ensure migrations are in correct chronological order
- Check for conflicting schema changes
- Verify database user has CREATE/ALTER/DROP permissions
- Review migration logs for specific SQL errors
- Ensure Drizzle schema matches database state
- Check if migration was partially applied
- Manually fix database state if needed, then mark migration as applied

#### 3. Connection Pool Exhausted

**Symptoms:**

- Error: "Too many connections"
- Error: "Connection pool timeout"
- Slow database queries
- Timeouts on database operations

**Solutions:**

```bash
# Check active connections
psql $DATABASE_URL -c "SELECT count(*) FROM pg_stat_activity;"

# View all connections
psql $DATABASE_URL -c "SELECT * FROM pg_stat_activity;"

# Kill idle connections
psql $DATABASE_URL -c "
SELECT pg_terminate_backend(pid)
FROM pg_stat_activity
WHERE state = 'idle'
AND state_change < current_timestamp - INTERVAL '5 minutes'
AND pid <> pg_backend_pid();
"
```

**Common Fixes:**

- Reduce connection pool size in postgres.js configuration (`connection_limit` in DATABASE_URL)
- Use connection pooling (PgBouncer for Neon, RDS Proxy for AWS)
- Increase max connections in PostgreSQL config
- Check for connection leaks in application code
- Ensure connections are properly closed after use
- Use serverless-friendly connection pooling
- Monitor connection usage over time

---

### Authentication Issues

#### 1. NextAuth Session Errors

**Symptoms:**

- Error: "Invalid session"
- Users logged out unexpectedly
- Error: "NEXTAUTH_SECRET must be provided"
- Error: "No session found"

**Solutions:**

```bash
# Generate new secret
openssl rand -base64 32

# Verify secret is set
echo $NEXTAUTH_SECRET

# Check in Docker
docker exec portfolio-admin printenv NEXTAUTH_SECRET

# Check session in database
psql $DATABASE_URL -c 'SELECT * FROM "Session" LIMIT 5;'

# Check user in database
psql $DATABASE_URL -c 'SELECT * FROM "User" WHERE email = '\''user@example.com'\'';'
```

**Common Fixes:**

- Ensure NEXTAUTH_SECRET is identical across all apps (public and admin)
- Verify NEXTAUTH_URL matches actual domain (no trailing slash)
- Check session maxAge in NextAuth config (default 30 days)
- Clear browser cookies and try again
- Verify database Session table exists and is accessible
- Check if session expired (compare expires field with current time)
- Ensure NEXTAUTH_URL uses https in production
- Verify database connection is stable

#### 2. Google OAuth Not Working

**Symptoms:**

- Error: "OAuth callback error"
- Error: "Invalid client ID"
- Error: "Redirect URI mismatch"
- Redirect loop after login
- Error: "Access denied"

**Solutions:**

```bash
# Test OAuth endpoint
curl https://yourdomain.com/api/auth/providers

# Check callback URL
curl https://yourdomain.com/api/auth/callback/google

# Verify credentials are set
docker exec portfolio-public printenv | grep GOOGLE
```

**Common Fixes:**

- Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
- Check authorized redirect URIs in Google Cloud Console:
  - Production: `https://yourdomain.com/api/auth/callback/google`
  - Development: `http://localhost:3000/api/auth/callback/google`
- Ensure OAuth consent screen is configured and published
- Verify domain is verified in Google Console (for production)
- Check if OAuth app is in production mode (not testing)
- Ensure scopes include email and profile
- Verify NEXTAUTH_URL matches the domain in redirect URI
- Check if user email is in test users list (if app is in testing mode)

#### 3. Guestbook Authentication Fails

**Symptoms:**

- Users can't sign in to leave guestbook entries
- Error: "Authentication required"
- Sign in button doesn't work
- Error: "Failed to sync user"

**Solutions:**

```bash
# Test auth sync endpoint
curl -X POST https://yourdomain.com/api/auth/sync \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test User","image":"https://example.com/avatar.jpg"}'

# Check user in database
psql $DATABASE_URL -c 'SELECT * FROM "User" WHERE email = '\''test@example.com'\'';'

# Test guestbook endpoint
curl https://admin.yourdomain.com/api/v1/public/guestbook
```

**Common Fixes:**

- Verify NEXTAUTH_SECRET matches between public and admin apps
- Check NEXT_PUBLIC_ADMIN_API_URL is correct and accessible
- Ensure admin API is running and accessible from public app
- Verify Google OAuth is configured correctly
- Check browser console for JavaScript errors
- Ensure CORS allows requests from public app domain
- Verify user sync endpoint is working
- Check if rate limiting is blocking requests

---

### Build and Deployment Issues

#### 1. Build Failures

**Symptoms:**

- Error: "Build failed"
- Error: "Module not found"
- TypeScript errors during build
- Error: "Cannot find package"

**Solutions:**

# Clear all caches

```bash
pnpm clean
rm -rf node_modules
rm -rf .next
rm -rf apps/*/node_modules
rm -rf apps/*/.next

# Reinstall dependencies
pnpm install

# Check for TypeScript errors
pnpm typecheck

# Try building specific app
pnpm --filter admin build
pnpm --filter public build

# Check Node.js version
node --version  # Should be >=22.0.0

# Check pnpm version
pnpm --version  # Should be >=8.0.0
```

**Common Fixes:**

- Verify Node.js version (requires >=22.0.0)
- Verify pnpm version (>=8.0.0)
- Check for missing dependencies in package.json
- Ensure all environment variables are set during build (NEXT*PUBLIC*\* vars)
- Review build logs for specific error messages
- Check disk space: `df -h`
- Ensure all imports are correct (case-sensitive on Linux)
- Check for circular dependencies
- Verify all required files exist

#### 2. Docker Build Failures

**Symptoms:**

- Error: "Docker build failed"
- Error: "COPY failed: no such file or directory"
- Container exits immediately after start
- Error: "Cannot find module"

**Solutions:**

```bash
# Build with verbose output
docker build -f Dockerfile.admin -t naufalrf-admin . --progress=plain --no-cache

# Check Docker logs
docker logs container-name

# Inspect container
docker inspect container-name

# Test container interactively
docker run -it naufalrf-admin sh

# Check build context
docker build -f Dockerfile.admin -t naufalrf-admin . --progress=plain 2>&1 | grep COPY
```

**Common Fixes:**

- Verify Dockerfile paths are correct (relative to build context)
- Check .dockerignore doesn't exclude required files
- Ensure base image is available and accessible
- Verify build context includes all necessary files
- Check for sufficient disk space: `docker system df`
- Review Docker daemon logs: `journalctl -u docker`
- Ensure multi-stage build copies all necessary files
- Check if pnpm-lock.yaml is included in build context
- Verify NODE_ENV is set correctly

#### 3. Deployment Timeouts

**Symptoms:**

- Deployment hangs indefinitely
- Health checks failing repeatedly
- Container restarts repeatedly
- Error: "Deployment timeout"

**Solutions:**

```bash
# Check container health
docker ps -a

# View container logs
docker logs --tail 100 -f container-name

# Check resource usage
docker stats

# Test health endpoint manually
curl http://localhost:3001/api/health

# Check if port is bound
netstat -tulpn | grep 3001

# Check container processes
docker exec container-name ps aux
```

**Common Fixes:**

- Increase deployment timeout in platform settings
- Verify health check endpoint is accessible and returns 200
- Check if application is binding to correct port (0.0.0.0, not localhost)
- Ensure sufficient memory/CPU allocated (min 512MB RAM)
- Review application startup logs for errors
- Check for blocking operations during startup
- Verify all environment variables are set
- Ensure database is accessible before app starts
- Check if migrations need to run first

---

### API and Network Issues

#### 1. API Calls Failing (CORS)

**Symptoms:**

- Error: "CORS policy blocked"
- Error: "No 'Access-Control-Allow-Origin' header"
- API works in Postman/curl but not browser
- Error: "Preflight request failed"

**Solutions:**

```bash
# Test API endpoint
curl -I https://admin.yourdomain.com/api/v1/public/about

# Check CORS headers
curl -H "Origin: https://yourdomain.com" \
  -H "Access-Control-Request-Method: GET" \
  -H "Access-Control-Request-Headers: Content-Type" \
  -X OPTIONS \
  -I https://admin.yourdomain.com/api/v1/public/about

# Test from browser console
fetch('https://admin.yourdomain.com/api/v1/public/about')
  .then(r => r.json())
  .then(console.log)
  .catch(console.error)
```

**Common Fixes:**

- Verify NEXT_PUBLIC_ADMIN_API_URL is correct (no trailing slash)
- Check CORS configuration in admin app middleware
- Ensure origin is whitelisted in CORS config
- For development: Add `http://localhost:3000` to allowed origins
- Check if API endpoint exists and is accessible
- Verify SSL certificate is valid
- Ensure preflight OPTIONS requests are handled
- Check if credentials are being sent (withCredentials)
- Verify Content-Type header is allowed

#### 2. Rate Limiting Errors

**Symptoms:**

- Error: "Too many requests"
- Status code: 429
- API calls blocked temporarily
- Error: "Rate limit exceeded"

**Solutions:**

```bash
# Check rate limit headers
curl -I https://admin.yourdomain.com/api/v1/public/contact

# Check X-RateLimit headers
curl -v https://admin.yourdomain.com/api/v1/public/contact 2>&1 | grep -i ratelimit

# Wait and retry
sleep 60 && curl https://admin.yourdomain.com/api/v1/public/contact
```

**Common Fixes:**

- Wait for rate limit window to reset (usually 60 seconds)
- Reduce request frequency in application
- Implement exponential backoff for retries
- Check rate limit configuration in admin app
- For testing: Temporarily increase rate limits
- Use caching to reduce API calls
- Implement request debouncing on client side
- Check if IP is being rate limited
- Verify rate limit is per-IP or per-user

#### 3. Slow API Response Times

**Symptoms:**

- API calls take >3 seconds
- Timeout errors
- Poor user experience
- Error: "Request timeout"

**Solutions:**

```bash
# Test API response time
time curl https://admin.yourdomain.com/api/v1/public/projects

# Test with verbose output
curl -w "@-" -o /dev/null -s https://admin.yourdomain.com/api/v1/public/projects <<'EOF'
    time_namelookup:  %{time_namelookup}\n
       time_connect:  %{time_connect}\n
    time_appconnect:  %{time_appconnect}\n
   time_pretransfer:  %{time_pretransfer}\n
      time_redirect:  %{time_redirect}\n
 time_starttransfer:  %{time_starttransfer}\n
                    ----------\n
         time_total:  %{time_total}\n
EOF

# Check database query performance
psql $DATABASE_URL -c 'EXPLAIN ANALYZE SELECT * FROM "Project" WHERE visible = true;'

# Monitor application performance
docker stats
```

**Common Fixes:**

- Add database indexes for frequently queried fields
- Implement caching (Redis, ISR with revalidate)
- Optimize database queries (select only needed fields)
- Enable CDN for static assets
- Increase server resources (CPU, memory)
- Use connection pooling for database
- Implement pagination for large datasets
- Optimize N+1 queries (use includes/joins)
- Enable response compression (gzip/brotli)
- Use database query optimization tools

---

### SSL and Domain Issues

#### 1. SSL Certificate Errors

**Symptoms:**

- Error: "Certificate expired"
- Error: "Certificate not trusted"
- Browser shows "Not secure"
- Error: "SSL handshake failed"

**Solutions:**

```bash
# Check certificate expiration
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | \
  openssl x509 -noout -dates

# Check certificate details
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | \
  openssl x509 -noout -text

# Renew Let's Encrypt certificate
sudo certbot renew

# Force renewal
sudo certbot renew --force-renewal

# Test certificate
curl -vI https://yourdomain.com 2>&1 | grep -i certificate
```

**Common Fixes:**

- Renew SSL certificate before expiration
- Verify certificate chain is complete
- Check if certificate matches domain name (including www)
- Ensure auto-renewal is configured (certbot cron job)
- For Cloudflare: Check SSL/TLS mode (Full or Full Strict)
- Verify DNS records are correct
- Check if certificate is for correct domain (not wildcard mismatch)
- Ensure Nginx is configured to use correct certificate files
- Restart Nginx after certificate renewal: `sudo systemctl reload nginx`

#### 2. Domain Not Resolving

**Symptoms:**

- Error: "DNS_PROBE_FINISHED_NXDOMAIN"
- Domain doesn't load
- Wrong IP address
- Error: "Server not found"

**Solutions:**

```bash
# Check DNS records
dig yourdomain.com
dig admin.yourdomain.com
dig links.yourdomain.com
dig ngl.yourdomain.com

# Check with specific DNS server
dig @8.8.8.8 yourdomain.com

# Check A records
dig A yourdomain.com +short

# Check CNAME records
dig CNAME admin.yourdomain.com +short

# Use nslookup
nslookup yourdomain.com

# Flush DNS cache (local)
# macOS
sudo dscacheutil -flushcache
sudo killall -HUP mDNSResponder

# Linux
sudo systemd-resolve --flush-caches

# Windows
ipconfig /flushdns
```

**Common Fixes:**

- Verify DNS records point to correct IP/CNAME
- Wait for DNS propagation (up to 48 hours, usually <1 hour)
- Check domain registrar settings
- Verify nameservers are correct
- For subdomains: Ensure CNAME or A records exist
- Check if domain is expired
- Verify DNS zone file is correct
- Check if domain is using correct nameservers
- Test from different locations/networks

---

### Performance Issues

#### 1. High Memory Usage

**Symptoms:**

- Application crashes with "Out of memory"
- Error: "JavaScript heap out of memory"
- Slow performance
- Container restarts frequently

**Solutions:**

```bash
# Check memory usage
docker stats

# Check Node.js heap size
node --max-old-space-size=4096 app.js

# Monitor memory in production
# Add to package.json start script
"start": "NODE_OPTIONS='--max-old-space-size=4096' next start"

# Check memory leaks
node --inspect app.js
# Then use Chrome DevTools to profile memory

# Check container memory limit
docker inspect container-name | grep -i memory
```

**Common Fixes:**

- Increase memory allocation in platform settings (min 1GB for production)
- Optimize database queries to reduce memory usage
- Implement pagination for large datasets
- Use streaming for large file operations
- Check for memory leaks in application code
- Enable garbage collection logging
- Reduce connection pool size
- Optimize image processing (use sharp with streaming)
- Clear caches periodically
- Use worker threads for CPU-intensive tasks

#### 2. High CPU Usage

**Symptoms:**

- Slow response times
- High server costs
- Throttling warnings
- Error: "CPU limit exceeded"

**Solutions:**

```bash
# Check CPU usage
top
htop

# Check Docker container CPU
docker stats

# Profile Node.js application
node --prof app.js
node --prof-process isolate-*.log > profile.txt

# Check for CPU-intensive operations
# Review application logs
docker logs container-name | grep -i "slow\|timeout"
```

**Common Fixes:**

- Optimize expensive operations (image processing, data transformation)
- Use worker threads for CPU-intensive tasks
- Implement caching to reduce computation
- Scale horizontally (add more instances)
- Use CDN for static assets
- Optimize database queries
- Use async/await properly (avoid blocking operations)
- Implement request queuing for heavy operations
- Use background jobs for non-critical tasks
- Profile and optimize hot code paths

### Environment Variable Issues

#### 1. Missing Environment Variables

**Symptoms:**

- Error: "Environment variable not defined"
- Application crashes on startup
- Features not working
- Error: "Cannot read property of undefined"

**Solutions:**

```bash
# List all environment variables
env | sort

# Check specific variable
echo $NEXTAUTH_SECRET

# Verify in Docker
docker exec container-name env | sort

# For Heroku
heroku config -a app-name

# For AWS ECS
aws ecs describe-task-definition --task-definition naufalrf-portfolio | \
  jq '.taskDefinition.containerDefinitions[].environment'
```

**Common Fixes:**

- Verify all required variables are set (check .env.example)
- Ensure variables are set in deployment platform
- For Docker: Pass variables in docker-compose.yml or -e flag
- For serverless: Set in platform dashboard
- Check variable names for typos (case-sensitive)
- Ensure NEXT*PUBLIC*\* variables are set at build time
- Verify secrets are properly loaded
- Check if .env file is in correct location

#### 2. Wrong Environment Variable Values

**Symptoms:**

- Features not working as expected
- API calls to wrong endpoints
- Authentication failures
- Error: "Invalid configuration"

**Solutions:**

```bash
# Verify variable values (be careful with secrets in production)
# Development only
cat .env.local | grep API_URL

# Check in running container (non-sensitive vars only)
docker exec container-name printenv NEXT_PUBLIC_ADMIN_API_URL

# Test API URL
curl $NEXT_PUBLIC_ADMIN_API_URL/health
```

**Common Fixes:**

- Verify URLs don't have trailing slashes
- Check for correct protocol (http vs https)
- Ensure secrets are properly encoded (no special characters issues)
- Verify domain names are correct
- Check for whitespace in variable values
- Use quotes for values with special characters
- Verify boolean values are strings ("true" not true)
- Check if variables are being overridden
- Ensure production values are different from development

---

### Getting Help

When troubleshooting:

1. **Check Logs First**
   - Application logs (stdout/stderr)
   - Platform logs (Heroku, AWS, Google Cloud)
   - Database logs
   - Web server logs (Nginx, Apache)
   - System logs (syslog, journalctl)

2. **Verify Configuration**
   - Environment variables (all required vars set)
   - Database connection (test with psql)
   - API endpoints (test with curl)
   - DNS records (test with dig/nslookup)
   - SSL certificates (test with openssl)

3. **Test Components Individually**
   - Database connection
   - API endpoints
   - Authentication flow
   - External services (R2, Resend, etc.)
   - Network connectivity

4. **Use Debugging Tools**
   - Browser DevTools (Network, Console, Application)
   - curl for API testing
   - psql for database queries
   - Docker logs and stats
   - Log aggregation services

5. **Consult Documentation**
   - This deployment guide
   - Platform-specific docs (Heroku, AWS, etc.)
   - Framework documentation (Next.js, Drizzle ORM)
   - Community forums (Stack Overflow, GitHub Discussions)

6. **Contact Support**
   - Platform support (Heroku, AWS, Google Cloud)
   - Database provider support (Neon, RDS)
   - Community Discord/Slack channels
   - GitHub issues (for bugs)

---

## Rollback Procedures

### General Rollback Strategy

1. **Identify the Issue**
   - Check logs for errors
   - Verify what changed in the deployment
   - Determine if rollback is necessary

2. **Communicate**
   - Notify team of rollback
   - Document the issue
   - Plan for fix and re-deployment

3. **Execute Rollback**
   - Follow platform-specific procedures below
   - Verify rollback was successful
   - Monitor application health

4. **Post-Rollback**
   - Investigate root cause
   - Fix the issue
   - Test thoroughly before re-deploying
   - Document lessons learned

### Heroku Rollback

#### View Release History

```bash
# List recent releases
heroku releases -a app-name

# View specific release details
heroku releases:info v123 -a app-name
```

#### Rollback to Previous Release

```bash
# Rollback to previous release
heroku rollback -a app-name

# Rollback to specific release
heroku rollback v123 -a app-name

# Verify rollback
heroku ps -a app-name
heroku logs --tail -a app-name
```

#### Rollback Database Migrations

```bash
# If migrations were run, you may need to rollback database
heroku run -a app-name "cd apps/admin && pnpm --filter admin db:migrate resolve --rolled-back MIGRATION_NAME"

# Or restore from backup
heroku pg:backups:restore BACKUP_ID DATABASE_URL -a app-name
```

### AWS ECS Rollback

#### View Task Definition History

```bash
# List task definitions
aws ecs list-task-definitions --family-prefix naufalrf-portfolio

# Describe specific task definition
aws ecs describe-task-definition --task-definition naufalrf-portfolio:5
```

#### Rollback to Previous Task Definition

```bash
# Update service to use previous task definition
aws ecs update-service \
  --cluster portfolio-cluster \
  --service portfolio-service \
  --task-definition naufalrf-portfolio:PREVIOUS_VERSION

# Force new deployment
aws ecs update-service \
  --cluster portfolio-cluster \
  --service portfolio-service \
  --force-new-deployment

# Monitor rollback
aws ecs describe-services \
  --cluster portfolio-cluster \
  --services portfolio-service

# Check task status
aws ecs list-tasks \
  --cluster portfolio-cluster \
  --service-name portfolio-service
```

#### Rollback Docker Images

```bash
# List ECR images
aws ecr describe-images \
  --repository-name naufalrf-admin \
  --query 'sort_by(imageDetails,& imagePushedAt)[-5:]'

# Update task definition to use previous image
# Edit task definition JSON and register new version
aws ecs register-task-definition --cli-input-json file://task-definition-rollback.json

# Update service
aws ecs update-service \
  --cluster portfolio-cluster \
  --service portfolio-service \
  --task-definition naufalrf-portfolio:NEW_VERSION
```

### Google Cloud App Engine Rollback

#### View Version History

```bash
# List versions
gcloud app versions list

# View specific version details
gcloud app versions describe VERSION_ID
```

#### Rollback to Previous Version

```bash
# Set traffic to previous version
gcloud app services set-traffic default \
  --splits PREVIOUS_VERSION=1

# Or migrate all traffic
gcloud app versions migrate PREVIOUS_VERSION

# Verify rollback
gcloud app versions list
gcloud app browse
```

#### Delete Failed Version

```bash
# Stop version
gcloud app versions stop VERSION_ID

# Delete version
gcloud app versions delete VERSION_ID
```

### AWS Elastic Beanstalk Rollback

#### View Environment History

```bash
# List environments
eb list

# View environment events
eb events

# View environment health
eb health
```

#### Rollback to Previous Version

```bash
# Deploy previous version
eb deploy --version PREVIOUS_VERSION

# Or use console to select previous version
# AWS Console > Elastic Beanstalk > Environment > Application versions

# Verify rollback
eb status
eb logs
```

### Docker Compose Rollback

#### Using Git

```bash
# View commit history
git log --oneline -10

# Checkout previous commit
git checkout PREVIOUS_COMMIT_HASH

# Rebuild and restart
docker-compose down
docker-compose build
docker-compose up -d

# Verify rollback
docker-compose ps
docker-compose logs -f
```

#### Using Docker Images

```bash
# List local images
docker images | grep naufalrf

# Stop current containers
docker-compose down

# Update docker-compose.yml to use previous image tag
# Or pull specific image version
docker pull naufalrf-admin:PREVIOUS_TAG

# Start with previous images
docker-compose up -d

# Verify rollback
docker-compose ps
docker-compose logs -f
```

#### Database Rollback

```bash
# Stop application
docker-compose stop admin public links ngl

# Restore database from backup
docker exec -i portfolio-postgres psql -U portfolio portfolio < backup.sql

# Or use pg_restore for custom format
docker exec -i portfolio-postgres pg_restore -U portfolio -d portfolio < backup.dump

# Restart application
docker-compose start admin public links ngl
```

### Database Migration Rollback

#### Drizzle Migration Rollback

```bash
# Mark migration as rolled back
pnpm --filter admin db:migrate  # Resolve migration issues --rolled-back MIGRATION_NAME

# Or restore database from backup
# Then mark all migrations as applied
pnpm --filter admin db:migrate  # Resolve migration issues --applied MIGRATION_NAME
```

#### Manual Database Rollback

```bash
# Connect to database
psql $DATABASE_URL

# View migration history
SELECT * FROM "__drizzle_migrations" ORDER BY finished_at DESC LIMIT 10;

# Manually revert changes (example)
DROP TABLE IF EXISTS "NewTable";
ALTER TABLE "ExistingTable" DROP COLUMN IF EXISTS "new_column";

# Mark migration as rolled back
UPDATE "__drizzle_migrations"
SET rolled_back_at = NOW()
WHERE migration_name = 'MIGRATION_NAME';
```

### Rollback Verification Checklist

After rollback, verify:

- [ ] Application is running and accessible
- [ ] Health checks are passing
- [ ] Database connections are working
- [ ] API endpoints are responding correctly
- [ ] Authentication is working
- [ ] No errors in application logs
- [ ] Performance is acceptable
- [ ] All features are working as expected
- [ ] Monitoring shows normal metrics
- [ ] Users can access the application

### Emergency Rollback

For critical issues requiring immediate rollback:

1. **Stop Traffic**

   ```bash
   # Put up maintenance page
   # Or redirect traffic to backup instance
   ```

2. **Quick Rollback**

   ```bash
   # Use fastest rollback method for your platform
   # Heroku: heroku rollback -a app-name
   # AWS ECS: Update service to previous task definition
   # Docker: git checkout previous && docker-compose up -d
   ```

3. **Verify**

   ```bash
   # Quick health check
   curl https://yourdomain.com/api/health
   ```

4. **Restore Traffic**

   ```bash
   # Remove maintenance page
   # Restore normal traffic routing
   ```

5. **Monitor**
   ```bash
   # Watch logs closely
   # Monitor error rates
   # Check user reports
   ```

---

## Maintenance

### Regular Tasks

#### 1. Database Backups

**Daily Automated Backups**

```bash
# Create backup script
cat > /usr/local/bin/backup-portfolio-db.sh <<'EOF'
#!/bin/bash
BACKUP_DIR="/var/backups/portfolio"
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="$BACKUP_DIR/portfolio_$DATE.sql"

mkdir -p $BACKUP_DIR

# Create backup
docker exec portfolio-postgres pg_dump -U portfolio portfolio > $BACKUP_FILE

# Compress backup
gzip $BACKUP_FILE

# Delete backups older than 30 days
find $BACKUP_DIR -name "*.sql.gz" -mtime +30 -delete

echo "Backup completed: $BACKUP_FILE.gz"
EOF

chmod +x /usr/local/bin/backup-portfolio-db.sh

# Add to crontab (daily at 2 AM)
crontab -e
# Add: 0 2 * * * /usr/local/bin/backup-portfolio-db.sh >> /var/log/portfolio-backup.log 2>&1
```

**Test Restore Procedures Monthly**

```bash
# Test restore in separate database
docker exec -i portfolio-postgres psql -U portfolio -c "CREATE DATABASE portfolio_test;"
gunzip -c /var/backups/portfolio/portfolio_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i portfolio-postgres psql -U portfolio portfolio_test

# Verify data
docker exec -i portfolio-postgres psql -U portfolio portfolio_test -c "SELECT COUNT(*) FROM \"Project\";"

# Cleanup
docker exec -i portfolio-postgres psql -U portfolio -c "DROP DATABASE portfolio_test;"
```

**Backup to Cloud Storage**

```bash
# Install AWS CLI or rclone
# Upload to S3/R2
aws s3 sync /var/backups/portfolio s3://your-backup-bucket/portfolio/ --storage-class GLACIER

# Or use rclone for R2
rclone sync /var/backups/portfolio r2:your-backup-bucket/portfolio/
```

#### 2. Dependency Updates

**Monthly Dependency Review**

```bash
# Check for outdated dependencies
pnpm outdated

# Update dependencies (patch versions)
pnpm update

# Update to latest (including minor/major)
pnpm update --latest

# Check for security vulnerabilities
pnpm audit

# Fix security issues
pnpm audit --fix
```

**Testing Before Production**

```bash
# Create staging branch
git checkout -b staging/dependency-updates

# Update dependencies
pnpm update --latest

# Run tests
pnpm test

# Build all apps
pnpm build

# Test locally
pnpm dev

# Deploy to staging environment
# Test thoroughly

# Merge to main after verification
git checkout main
git merge staging/dependency-updates
```

#### 3. SSL Certificate Renewal

**Automated with Certbot**

```bash
# Verify auto-renewal is configured
sudo certbot renew --dry-run

# Check cron job
sudo crontab -l | grep certbot

# Manual renewal if needed
sudo certbot renew

# Reload Nginx after renewal
sudo systemctl reload nginx
```

**Monitor Certificate Expiration**

```bash
# Check expiration date
openssl s_client -connect yourdomain.com:443 -servername yourdomain.com 2>/dev/null | \
  openssl x509 -noout -dates

# Set up monitoring alert (30 days before expiration)
# Use monitoring service or custom script
```

#### 4. Log Rotation

**Configure Log Rotation**

```bash
# Create logrotate config
sudo nano /etc/logrotate.d/portfolio

# Add configuration:
/var/log/portfolio/*.log {
    daily
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data www-data
    sharedscripts
    postrotate
        docker-compose restart admin public links ngl
    endscript
}

# Test configuration
sudo logrotate -d /etc/logrotate.d/portfolio

# Force rotation
sudo logrotate -f /etc/logrotate.d/portfolio
```

**Docker Logs**

```bash
# Configure Docker log rotation in daemon.json
sudo nano /etc/docker/daemon.json

# Add:
{
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}

# Restart Docker
sudo systemctl restart docker
```

#### 5. Security Updates

**System Updates**

```bash
# Update system packages (Ubuntu/Debian)
sudo apt update
sudo apt upgrade -y

# Update Docker
sudo apt update
sudo apt install docker-ce docker-ce-cli containerd.io

# Update Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" \
  -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

**Security Monitoring**

```bash
# Check for security advisories
# Subscribe to:
# - Next.js security advisories
# - Drizzle ORM security advisories
# - Node.js security advisories

# Monitor CVEs
pnpm audit

# Check Docker images for vulnerabilities
docker scan naufalrf-admin:latest
```

#### 6. Performance Monitoring

**Set Up Monitoring**

- Application Performance Monitoring (APM)
  - New Relic
  - Datadog
  - Dynatrace

- Error Tracking
  - Sentry
  - Rollbar
  - Bugsnag

- Uptime Monitoring
  - UptimeRobot
  - Pingdom
  - StatusCake

- Log Aggregation
  - Logtail
  - Papertrail
  - CloudWatch Logs

**Regular Performance Checks**

```bash
# Check response times
time curl https://yourdomain.com

# Check database performance
psql $DATABASE_URL -c "
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# Check slow queries
psql $DATABASE_URL -c "
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
"
```

#### 7. Database Maintenance

**Weekly Maintenance**

```bash
# Vacuum database
docker exec portfolio-postgres psql -U portfolio portfolio -c "VACUUM ANALYZE;"

# Reindex
docker exec portfolio-postgres psql -U portfolio portfolio -c "REINDEX DATABASE portfolio;"

# Check database size
docker exec portfolio-postgres psql -U portfolio portfolio -c "
SELECT pg_size_pretty(pg_database_size('portfolio'));
"
```

**Monitor Database Health**

```bash
# Check for bloat
docker exec portfolio-postgres psql -U portfolio portfolio -c "
SELECT schemaname, tablename,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS total_size,
       pg_size_pretty(pg_relation_size(schemaname||'.'||tablename)) AS table_size,
       pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename) -
                      pg_relation_size(schemaname||'.'||tablename)) AS index_size
FROM pg_tables
WHERE schemaname NOT IN ('pg_catalog', 'information_schema')
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
"

# Check connection count
docker exec portfolio-postgres psql -U portfolio portfolio -c "
SELECT count(*) as connections FROM pg_stat_activity;
"
```

### Maintenance Windows

**Planned Maintenance**

1. **Schedule Maintenance**
   - Choose low-traffic time (e.g., Sunday 2-4 AM)
   - Notify users in advance
   - Prepare rollback plan

2. **During Maintenance**

   ```bash
   # Put up maintenance page
   # Update Nginx config or use platform maintenance mode

   # Perform updates
   git pull
   pnpm install
   pnpm build
   docker-compose down
   docker-compose up -d --build

   # Run migrations if needed
   docker exec portfolio-admin pnpm --filter admin db:migrate

   # Verify everything works
   curl https://yourdomain.com/api/health

   # Remove maintenance page
   ```

3. **Post-Maintenance**
   - Verify all services are running
   - Check logs for errors
   - Monitor performance
   - Notify users maintenance is complete

### Disaster Recovery

**Backup Strategy**

- Database: Daily automated backups, retained for 30 days
- Code: Git repository (GitHub/GitLab)
- Environment variables: Securely stored in password manager
- SSL certificates: Backed up with auto-renewal configured
- User uploads: Stored in R2 with versioning enabled

**Recovery Procedures**

1. **Database Failure**

   ```bash
   # Restore from latest backup
   gunzip -c /var/backups/portfolio/latest.sql.gz | \
     docker exec -i portfolio-postgres psql -U portfolio portfolio
   ```

2. **Application Failure**

   ```bash
   # Redeploy from git
   git pull
   docker-compose down
   docker-compose up -d --build
   ```

3. **Complete Server Failure**
   - Provision new server
   - Install Docker and Docker Compose
   - Clone repository
   - Restore database from backup
   - Configure environment variables
   - Deploy application
   - Update DNS records

---

## Support

For deployment issues or questions:

1. **Review Documentation**
   - This deployment guide
   - Platform-specific documentation
   - Framework documentation

2. **Check Logs**
   - Application logs
   - Platform logs
   - Database logs

3. **Community Support**
   - GitHub Discussions
   - Stack Overflow
   - Discord/Slack communities

4. **Professional Support**
   - Platform support (Heroku, AWS, Google Cloud)
   - Database provider support
   - Consulting services

---

## Additional Resources

- [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)
- [Drizzle ORM Deployment Guide](https://orm.drizzle.team/docs/guides/deployment)
- [Docker Documentation](https://docs.docker.com/)
- [Nginx Documentation](https://nginx.org/en/docs/)
- [Let's Encrypt Documentation](https://letsencrypt.org/docs/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

---

**Last Updated:** January 2026

**Version:** 1.0.0

For updates to this documentation, please submit a pull request or open an issue on GitHub.
