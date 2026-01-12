# Troubleshooting Guide

This guide helps you diagnose and resolve common issues in the NaufalRF Portfolio Ecosystem.

## Table of Contents

- [Installation Issues](#installation-issues)
- [Build Issues](#build-issues)
- [Runtime Issues](#runtime-issues)
- [Database Issues](#database-issues)
- [Authentication Issues](#authentication-issues)
- [API Issues](#api-issues)
- [Deployment Issues](#deployment-issues)
- [Performance Issues](#performance-issues)

---

## Installation Issues

### pnpm install fails

**Symptoms:**

- Installation errors
- Missing dependencies
- Version conflicts

**Solutions:**

1. **Clear caches and reinstall**

   ```bash
   pnpm clean
   rm -rf node_modules
   rm pnpm-lock.yaml
   pnpm install
   ```

2. **Check Node.js version**

   ```bash
   node --version  # Should be >= 22.0.0
   ```

3. **Check pnpm version**

   ```bash
   pnpm --version  # Should be >= 8.0.0
   ```

4. **Update pnpm**
   ```bash
   npm install -g pnpm@latest
   ```

### Workspace resolution errors

**Symptoms:**

- "Cannot find workspace" errors
- Package not found in workspace

**Solutions:**

1. **Verify pnpm-workspace.yaml**

   ```yaml
   packages:
     - 'apps/*'
     - 'packages/*'
   ```

2. **Check package.json names**
   - Ensure package names match workspace references
   - Example: `@repo/ui` in packages/ui/package.json

3. **Reinstall dependencies**
   ```bash
   pnpm install --force
   ```

---

## Build Issues

### TypeScript errors

**Symptoms:**

- Type errors during build
- "Cannot find module" errors
- Type mismatches

**Solutions:**

1. **Regenerate Prisma client**

   ```bash
   pnpm --filter admin db:generate
   ```

2. **Clear TypeScript cache**

   ```bash
   rm -rf apps/*/.next
   rm -rf apps/*/tsconfig.tsbuildinfo
   pnpm typecheck
   ```

3. **Restart TypeScript server (VS Code)**
   - Command Palette → "TypeScript: Restart TS Server"

4. **Check tsconfig.json**
   - Ensure paths are correct
   - Verify extends configuration

### Build fails with "Module not found"

**Symptoms:**

- Build succeeds locally but fails in CI/production
- Missing module errors

**Solutions:**

1. **Check imports**

   ```typescript
   // ❌ Bad - relative import outside workspace
   import { Button } from '../../../packages/ui/Button';

   // ✅ Good - workspace import
   import { Button } from '@repo/ui';
   ```

2. **Verify package.json dependencies**
   - Ensure all dependencies are listed
   - Check for missing peer dependencies

3. **Clear Turbo cache**
   ```bash
   rm -rf .turbo
   pnpm build
   ```

### Next.js build errors

**Symptoms:**

- "Error: Cannot find module" during build
- Build hangs or times out

**Solutions:**

1. **Clear Next.js cache**

   ```bash
   rm -rf apps/*/.next
   pnpm build
   ```

2. **Check environment variables**
   - Ensure all required env vars are set
   - Verify NEXT*PUBLIC* prefix for client-side vars

3. **Increase Node.js memory**
   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm build
   ```

---

## Runtime Issues

### Port already in use

**Symptoms:**

- "EADDRINUSE: address already in use"
- Cannot start development server

**Solutions:**

1. **Find and kill process**

   ```bash
   # Find process using port 3000
   lsof -i :3000

   # Kill process
   kill -9 <PID>
   ```

2. **Use different port**

   ```bash
   PORT=3010 pnpm --filter admin dev
   ```

3. **Kill all Node processes**
   ```bash
   killall node
   ```

### Hot reload not working

**Symptoms:**

- Changes not reflected in browser
- Need to manually refresh

**Solutions:**

1. **Check file watcher limits (Linux)**

   ```bash
   # Increase limit
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

2. **Restart development server**

   ```bash
   # Stop all servers
   pkill -f "next dev"

   # Restart
   pnpm dev
   ```

3. **Clear Next.js cache**
   ```bash
   rm -rf apps/*/.next
   pnpm dev
   ```

### Environment variables not loading

**Symptoms:**

- `undefined` when accessing env vars
- Features not working as expected

**Solutions:**

1. **Check .env file location**
   - Root: `.env`
   - Admin: `apps/admin/.env.local`
   - Public: `apps/public/.env`

2. **Verify variable names**
   - Client-side vars need `NEXT_PUBLIC_` prefix
   - Server-side vars don't need prefix

3. **Restart development server**

   ```bash
   # Environment variables are loaded on server start
   pnpm dev
   ```

4. **Check for typos**
   ```bash
   # List all env vars
   printenv | grep NEXT
   ```

---

## Database Issues

### Cannot connect to database

**Symptoms:**

- "Connection refused" errors
- "Authentication failed" errors
- Timeout errors

**Solutions:**

1. **Test connection**

   ```bash
   psql "postgresql://user:password@host:5432/database"
   ```

2. **Check DATABASE_URL format**

   ```bash
   # Correct format
   DATABASE_URL="postgresql://user:password@host:5432/database?schema=public"

   # For Neon, add sslmode
   DATABASE_URL="postgresql://user:password@host:5432/database?sslmode=require"
   ```

3. **Verify database is running**

   ```bash
   # Check PostgreSQL status
   pg_isready -h localhost -p 5432

   # Or check Docker container
   docker ps | grep postgres
   ```

4. **Check firewall rules**
   - Ensure port 5432 is open
   - Check cloud provider security groups

### Prisma migration fails

**Symptoms:**

- Migration errors
- Schema out of sync
- "Migration failed" messages

**Solutions:**

1. **Check migration status**

   ```bash
   pnpm --filter admin prisma migrate status
   ```

2. **Reset database (dev only)**

   ```bash
   # WARNING: This deletes all data
   pnpm --filter admin prisma migrate reset
   ```

3. **Mark migration as applied**

   ```bash
   pnpm --filter admin prisma migrate resolve --applied <migration-name>
   ```

4. **Create new migration**
   ```bash
   pnpm --filter admin prisma migrate dev --name fix_schema
   ```

### Prisma Client not generated

**Symptoms:**

- "Cannot find module '@prisma/client'"
- Type errors for Prisma models

**Solutions:**

1. **Generate Prisma Client**

   ```bash
   pnpm --filter admin db:generate
   ```

2. **Reinstall dependencies**

   ```bash
   cd apps/admin
   rm -rf node_modules
   pnpm install
   pnpm db:generate
   ```

3. **Check Prisma schema**
   - Ensure schema.prisma is valid
   - Run `pnpm --filter admin prisma validate`

---

## Authentication Issues

### Google OAuth not working

**Symptoms:**

- "Invalid client" errors
- Redirect URI mismatch
- Cannot sign in

**Solutions:**

1. **Verify redirect URIs in Google Console**

   ```
   http://localhost:3000/api/auth/callback/google
   http://localhost:3001/api/auth/callback/google
   https://naufalrf.tech/api/auth/callback/google
   https://admin.naufalrf.tech/api/auth/callback/google
   ```

2. **Check environment variables**

   ```bash
   # Verify these are set
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   NEXTAUTH_SECRET="your-secret"
   NEXTAUTH_URL="http://localhost:3001"  # No trailing slash!
   ```

3. **Generate new NEXTAUTH_SECRET**

   ```bash
   openssl rand -base64 32
   ```

4. **Ensure NEXTAUTH_SECRET is identical**
   - Must be same in admin and public apps
   - Check all .env files

### Session not persisting

**Symptoms:**

- Logged out after refresh
- Session expires immediately
- "Unauthorized" errors

**Solutions:**

1. **Check NEXTAUTH_SECRET**
   - Must be set in all apps
   - Must be identical across apps

2. **Check NEXTAUTH_URL**
   - Must match actual domain
   - No trailing slash
   - Use HTTPS in production

3. **Clear cookies**
   - Clear browser cookies
   - Try incognito mode

4. **Check session configuration**
   ```typescript
   // In NextAuth config
   session: {
     strategy: 'jwt',
     maxAge: 30 * 24 * 60 * 60, // 30 days
   }
   ```

### Admin access denied

**Symptoms:**

- "Unauthorized" when accessing admin routes
- User has wrong role

**Solutions:**

1. **Check ADMIN_EMAILS**

   ```bash
   # In apps/admin/.env.local
   ADMIN_EMAILS="admin@example.com,another@example.com"
   ```

2. **Verify user email**
   - Must match exactly (case-sensitive)
   - Check for typos

3. **Update user role in database**

   ```sql
   UPDATE users SET role = 'ADMIN' WHERE email = 'admin@example.com';
   ```

4. **Sign out and sign in again**
   - Role is set during sign-in
   - Need to re-authenticate

---

## API Issues

### API returns 404

**Symptoms:**

- "Not found" errors
- API endpoint not accessible

**Solutions:**

1. **Check API route path**

   ```typescript
   // Correct structure
   apps /
     admin /
     app /
     api /
     v1 /
     public /
     projects /
     route.ts /
     // Accessible at
     api /
     v1 /
     public /
     projects;
   ```

2. **Verify HTTP method**

   ```typescript
   // Must export correct method
   export async function GET(request: Request) {}
   export async function POST(request: Request) {}
   ```

3. **Check NEXT_PUBLIC_ADMIN_API_URL**
   ```bash
   # In public app .env
   NEXT_PUBLIC_ADMIN_API_URL="http://localhost:3001/api"
   ```

### API returns 500

**Symptoms:**

- Internal server errors
- Unexpected errors

**Solutions:**

1. **Check server logs**

   ```bash
   # View logs in terminal where server is running
   pnpm --filter admin dev
   ```

2. **Check database connection**

   ```bash
   # Test Prisma connection
   pnpm --filter admin prisma studio
   ```

3. **Add error logging**
   ```typescript
   try {
     // API logic
   } catch (error) {
     console.error('API Error:', error);
     return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
   }
   ```

### Rate limiting issues

**Symptoms:**

- "Too many requests" errors
- 429 status codes

**Solutions:**

1. **Wait for rate limit window to reset**
   - Check X-RateLimit-Reset header
   - Wait specified time

2. **Use different IP (development)**
   - Use VPN
   - Use mobile hotspot

3. **Adjust rate limits (development)**
   ```typescript
   // In rate limit middleware
   const limiter = rateLimit({
     windowMs: 60 * 1000, // 1 minute
     max: 100, // Increase for development
   });
   ```

---

## Deployment Issues

### Build fails in production

**Symptoms:**

- Build succeeds locally but fails in production
- Missing environment variables

**Solutions:**

1. **Check environment variables**
   - Ensure all required vars are set in production
   - Verify no typos in variable names

2. **Check build logs**
   - Review deployment platform logs
   - Look for specific error messages

3. **Test production build locally**

   ```bash
   pnpm build
   pnpm start
   ```

4. **Check Node.js version**
   - Ensure production uses Node.js 22+
   - Set in package.json engines field

### Database migrations fail in production

**Symptoms:**

- Migration errors during deployment
- Schema out of sync

**Solutions:**

1. **Run migrations manually**

   ```bash
   # SSH into production server
   cd apps/admin
   pnpm prisma migrate deploy
   ```

2. **Check migration status**

   ```bash
   pnpm prisma migrate status
   ```

3. **Backup database first**
   ```bash
   pg_dump -h host -U user -d database > backup.sql
   ```

### SSL/TLS errors

**Symptoms:**

- "SSL connection error"
- Certificate errors

**Solutions:**

1. **Add sslmode to DATABASE_URL**

   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/db?sslmode=require"
   ```

2. **Check certificate validity**

   ```bash
   openssl s_client -connect host:5432 -starttls postgres
   ```

3. **Update SSL certificates**
   - Renew Let's Encrypt certificates
   - Update Traefik configuration

---

## Performance Issues

### Slow page loads

**Symptoms:**

- Pages take long to load
- High Time to First Byte (TTFB)

**Solutions:**

1. **Enable caching**

   ```typescript
   // In API routes
   export const revalidate = 60; // ISR every 60 seconds
   ```

2. **Optimize images**

   ```typescript
   // Use Next.js Image component
   import Image from 'next/image';

   <Image
     src="/image.jpg"
     width={800}
     height={600}
     alt="Description"
   />
   ```

3. **Check database queries**

   ```typescript
   // Use select to limit fields
   const projects = await prisma.project.findMany({
     select: {
       id: true,
       title: true,
       slug: true,
     },
   });
   ```

4. **Enable compression**
   - Ensure gzip/brotli compression is enabled
   - Check Traefik/Nginx configuration

### High memory usage

**Symptoms:**

- Out of memory errors
- Server crashes

**Solutions:**

1. **Increase Node.js memory**

   ```bash
   NODE_OPTIONS="--max-old-space-size=4096" pnpm start
   ```

2. **Check for memory leaks**

   ```bash
   # Use Node.js profiler
   node --inspect apps/admin/server.js
   ```

3. **Optimize database queries**
   - Use pagination
   - Limit result sets
   - Add indexes

4. **Scale horizontally**
   - Add more server instances
   - Use load balancer

### Slow database queries

**Symptoms:**

- API responses take long
- Database timeouts

**Solutions:**

1. **Add indexes**

   ```prisma
   @@index([field1, field2])
   ```

2. **Use EXPLAIN ANALYZE**

   ```sql
   EXPLAIN ANALYZE SELECT * FROM projects WHERE visible = true;
   ```

3. **Optimize queries**

   ```typescript
   // Use cursor-based pagination for large datasets
   const projects = await prisma.project.findMany({
     take: 10,
     cursor: { id: lastId },
   });
   ```

4. **Enable connection pooling**
   ```bash
   DATABASE_URL="postgresql://user:password@host:5432/db?connection_limit=10"
   ```

---

## Getting Help

If you can't resolve an issue:

1. **Check existing documentation**
   - [Setup Guide](./SETUP.md)
   - [Architecture](./ARCHITECTURE.md)
   - [Development Guide](./DEVELOPMENT.md)

2. **Search GitHub issues**
   - Check if issue already reported
   - Look for similar problems

3. **Create a new issue**
   - Provide detailed description
   - Include error messages
   - Share relevant code snippets
   - Specify environment (OS, Node version, etc.)

4. **Contact support**
   - Email: hello@naufalrf.tech
   - Include issue details and steps to reproduce

---

## Diagnostic Commands

### System Information

```bash
# Node.js version
node --version

# pnpm version
pnpm --version

# Check all dependencies
pnpm list --depth=0

# Check for outdated packages
pnpm outdated
```

### Application Health

```bash
# Check if apps are running
ps aux | grep node

# Check ports in use
lsof -i :3000
lsof -i :3001

# Test API endpoints
curl http://localhost:3001/api/health
```

### Database Health

```bash
# Test connection
psql "postgresql://user:password@host:5432/database"

# Check database size
psql -c "SELECT pg_size_pretty(pg_database_size('database'));"

# Check active connections
psql -c "SELECT count(*) FROM pg_stat_activity;"
```

### Logs

```bash
# View application logs
pnpm --filter admin dev

# View Docker logs
docker logs portfolio-admin

# View system logs (Linux)
journalctl -u portfolio-admin -f
```

---

## Prevention

### Best Practices

1. **Regular backups**
   - Backup database daily
   - Store backups securely
   - Test restore procedures

2. **Monitor logs**
   - Set up log aggregation
   - Monitor error rates
   - Set up alerts

3. **Keep dependencies updated**

   ```bash
   pnpm update --latest
   ```

4. **Test before deploying**
   - Run all tests
   - Test on staging first
   - Verify critical features

5. **Document changes**
   - Update CHANGELOG
   - Document breaking changes
   - Update environment variables

---

## Emergency Procedures

### Rollback Deployment

```bash
# Rollback to previous version
./scripts/rollback.sh v1.0.0

# Or manually
git checkout v1.0.0
pnpm build
pnpm start
```

### Database Restore

```bash
# Stop application
docker-compose down

# Restore backup
psql -h host -U user -d database < backup.sql

# Restart application
docker-compose up -d
```

### Clear All Caches

```bash
# Clear all caches and rebuild
pnpm clean
rm -rf node_modules
rm -rf .turbo
rm -rf apps/*/.next
rm -rf apps/*/tsconfig.tsbuildinfo
pnpm install
pnpm build
```
