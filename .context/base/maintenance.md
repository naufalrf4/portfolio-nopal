# Maintenance

This document defines the operational procedures for monitoring, updating, and responding to incidents in the NaufalRF Portfolio Ecosystem.

---

## Monitoring

### Health Check Endpoints

Every service exposes a health endpoint for monitoring and load balancer integration.

| Service | Endpoint | Expected Response |
|---------|----------|-------------------|
| Public Portfolio | `GET /api/health` | `{ "status": "ok", "timestamp": "..." }` |
| Admin Dashboard | `GET /api/health` | `{ "status": "ok", "db": "connected", "timestamp": "..." }` |
| Links Hub | `GET /api/health` | `{ "status": "ok", "timestamp": "..." }` |
| NGL App | `GET /api/health` | `{ "status": "ok", "timestamp": "..." }` |
| RAG Service | `GET /health` | `{ "status": "ok", "qdrant": "connected", "timestamp": "..." }` |

**Health Check Implementation:**
- Return `200 OK` when service is healthy
- Return `503 Service Unavailable` when dependencies are down
- Include dependency status (database, Qdrant) where applicable
- Keep response lightweight (< 100ms)

### Uptime Monitoring

**External Monitoring Service:**
- Use UptimeRobot, Better Uptime, or similar
- Monitor all public endpoints every 5 minutes
- Alert on downtime via email or Slack

**Monitored URLs:**
- `https://naufalrf.tech` (public portfolio)
- `https://admin.naufalrf.tech` (admin dashboard)
- `https://links.naufalrf.tech` (links hub)
- `https://ngl.naufalrf.tech` (anonymous feedback)
- `https://rag.naufalrf.tech/health` (RAG service)

### Application Metrics

**Key Metrics to Track:**

| Metric | Source | Target |
|--------|--------|--------|
| Request count | Access logs | Baseline understanding |
| Response time (p50, p95, p99) | Application logs | p95 < 500ms |
| Error rate | Application logs | < 0.1% |
| CPU usage | Container metrics | < 80% sustained |
| Memory usage | Container metrics | < 80% sustained |
| Database connections | Prisma metrics | < pool limit |
| Qdrant query time | RAG service logs | < 200ms |

**Logging Strategy:**
- Use structured JSON logging (Pino)
- Include correlation IDs for request tracing
- Log levels: error, warn, info, debug
- Production: info and above
- Development: debug and above

**Log Retention:**
- Container logs: 7 days local
- Aggregated logs (if enabled): 30 days
- Error logs: 90 days

### Dashboard (Optional)

For advanced monitoring, consider:
- **Grafana** with Prometheus for metrics visualization
- **Loki** for log aggregation
- **Simple alternative**: Grep through Docker logs

---

## Updates

### Dependency Updates

**Frequency:**
- Security updates: immediately upon notification
- Minor updates: weekly review via Dependabot
- Major updates: monthly evaluation

**Process for Routine Updates:**

1. **Review Dependabot PRs**
   - Check changelog for breaking changes
   - Verify CI passes
   - Test locally if significant

2. **Merge and Monitor**
   - Squash merge to main
   - Monitor production for issues
   - Rollback if problems detected

**Process for Major Updates:**

1. **Evaluate Impact**
   - Read migration guide
   - Identify breaking changes
   - Estimate effort

2. **Create Feature Branch**
   - `chore/upgrade-<package>-v<version>`
   - Make required code changes
   - Update tests as needed

3. **Test Thoroughly**
   - Run full test suite
   - Manual testing of affected features
   - Performance comparison

4. **Deploy and Monitor**
   - Merge to main
   - Monitor for 24-48 hours
   - Be ready to rollback

### Infrastructure Updates

**Traefik Updates:**
- Review release notes for breaking changes
- Update image tag in docker-compose
- Test in development first
- Deploy during low-traffic window

**Database Migrations:**
- Always backup before migration
- Run `prisma migrate deploy` in production
- Never use `prisma migrate dev` in production
- Test rollback procedure

**Node.js Updates:**
- Update base image in Dockerfiles
- Test full build locally
- Run complete test suite
- Deploy during low-traffic window

### Update Checklist

```markdown
## Pre-Update
- [ ] Backup database (if applicable)
- [ ] Review changelog/release notes
- [ ] Identify potential breaking changes
- [ ] Ensure rollback path exists

## Update
- [ ] Apply update in development
- [ ] Run test suite
- [ ] Manual smoke testing
- [ ] Create PR and get CI green

## Post-Update
- [ ] Deploy to production
- [ ] Monitor health endpoints
- [ ] Check error rates
- [ ] Verify key functionality
- [ ] Document any issues
```

---

## Incident Response

### Severity Levels

| Level | Definition | Response Time | Examples |
|-------|------------|---------------|----------|
| P1 - Critical | All services down, data loss risk | Immediate | Database unreachable, TLS expired |
| P2 - High | Major feature broken for all users | < 1 hour | Auth failing, chatbot down |
| P3 - Medium | Feature degraded, workaround exists | < 4 hours | Slow responses, minor UI bug |
| P4 - Low | Minor issue, no user impact | < 24 hours | Log warning, cosmetic issue |

### Incident Response Procedure

**1. Detection**
- Uptime monitor alert
- User report
- Error log spike
- Manual discovery

**2. Triage**
- Assess severity level
- Identify affected services
- Estimate user impact
- Decide on response urgency

**3. Investigation**

```bash
# Check service status
docker compose ps

# View recent logs
docker compose logs --tail 100 <service>

# Check resource usage
docker stats

# Check database connectivity
docker compose exec admin npx prisma db execute --stdin <<< "SELECT 1"

# Check Qdrant status
curl http://localhost:6333/health
```

**4. Mitigation**
- Apply quick fix if available
- Rollback to previous version if needed
- Scale resources if capacity issue
- Disable problematic feature if necessary

**5. Resolution**
- Implement permanent fix
- Test thoroughly
- Deploy fix
- Verify resolution

**6. Post-Mortem**
- Document what happened
- Identify root cause
- List action items
- Update procedures if needed

### Common Issues and Solutions

#### Service Won't Start

**Symptoms:** Container exits immediately or restart loop

**Diagnosis:**
```bash
docker compose logs <service>
docker compose ps
```

**Common Causes:**
- Environment variable missing → Check .env file
- Port conflict → Check for other services on port
- Build failure → Rebuild image
- Dependency unavailable → Check database/Qdrant

**Solution:**
```bash
# Rebuild and restart
docker compose build <service>
docker compose up -d <service>
```

---

#### Database Connection Errors

**Symptoms:** 500 errors, "Connection refused" in logs

**Diagnosis:**
```bash
# Check Neon dashboard for issues
# Check connection pool exhaustion
docker compose logs admin | grep -i "connection"
```

**Common Causes:**
- Neon maintenance window
- Connection pool exhausted
- Invalid credentials
- Network issues

**Solution:**
- Wait for Neon maintenance to complete
- Restart admin service to reset pool
- Verify DATABASE_URL is correct
- Check Neon status page

---

#### High Memory Usage

**Symptoms:** OOM kills, slow responses

**Diagnosis:**
```bash
docker stats
```

**Common Causes:**
- Memory leak in application
- Large payloads in memory
- Too many concurrent requests

**Solution:**
```bash
# Restart affected service
docker compose restart <service>

# If persistent, increase memory limit
# In docker-compose.yaml:
# deploy:
#   resources:
#     limits:
#       memory: 1G
```

---

#### RAG Service Not Responding

**Symptoms:** Chat returns errors, ingestion fails

**Diagnosis:**
```bash
docker compose logs rag-service
curl http://localhost:6333/health  # Check Qdrant
```

**Common Causes:**
- Qdrant container down
- LLM API rate limited
- Memory exhaustion
- Service crash

**Solution:**
```bash
# Restart Qdrant
docker compose restart qdrant

# Restart RAG service
docker compose restart rag-service

# Check LLM API status
# Verify API keys are valid
```

---

#### TLS Certificate Issues

**Symptoms:** Browser security warnings, HTTPS errors

**Diagnosis:**
```bash
# Check certificate expiry
echo | openssl s_client -connect naufalrf.tech:443 2>/dev/null | openssl x509 -noout -dates

# Check Traefik logs
docker compose logs traefik | grep -i "acme\|certificate"
```

**Common Causes:**
- Let's Encrypt rate limit
- DNS propagation delay
- Traefik configuration error

**Solution:**
```bash
# Force certificate renewal
docker compose restart traefik

# If rate limited, wait 1 hour
# Verify DNS records are correct
```

---

### Rollback Procedure

**When to Rollback:**
- New deployment causes errors
- Feature is broken for users
- Performance degradation
- Security vulnerability introduced

**Rollback Steps:**

```bash
# 1. Identify previous working image
docker images | grep portfolio

# 2. Update docker-compose to use previous tag
# Change: image: ghcr.io/naufalrf/portfolio-public:latest
# To: image: ghcr.io/naufalrf/portfolio-public:<previous-sha>

# 3. Deploy previous version
docker compose up -d <service>

# 4. Verify rollback
curl https://naufalrf.tech/api/health

# 5. Investigate root cause before re-deploying
```

**Database Rollback:**
- Prisma migrations are forward-only by design
- For critical issues, restore from backup
- Test rollback procedure regularly

---

### Backup Procedures

**Database Backup:**
- Neon provides automatic backups
- Point-in-time recovery available
- Manual backup before major changes:

```bash
# Export database (if needed)
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql
```

**Qdrant Backup:**
```bash
# Stop Qdrant for consistent backup
docker compose stop qdrant

# Backup volume
docker run --rm -v portfolio_qdrant:/data -v $(pwd):/backup alpine \
  tar czf /backup/qdrant-backup-$(date +%Y%m%d).tar.gz /data

# Restart Qdrant
docker compose start qdrant
```

**Configuration Backup:**
- All configuration is in Git
- Environment variables documented in .env.example
- Keep secure backup of production .env file

---

### Contact and Escalation

**Primary Contact:**
- Owner/Admin: naufalrf32@gmail.com

**External Services:**
- Neon Support: https://neon.tech/support
- Vercel (if used): https://vercel.com/support
- GitHub: https://support.github.com

**Escalation Path:**
1. Check documentation and runbooks
2. Search GitHub issues for similar problems
3. Check external service status pages
4. Contact external service support if needed
