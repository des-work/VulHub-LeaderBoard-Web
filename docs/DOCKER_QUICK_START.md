# 🐳 Docker Quick Start - VulHub Leaderboard

## ⚡ Quick Commands

### Start Development Environment
```bash
git clone https://github.com/your-username/VulHub-LeaderBoard-Web.git
cd VulHub-LeaderBoard-Web
cp env.example .env
docker-compose -f docker-compose.dev.yml up --build
```

### Access URLs
- **Website**: http://localhost:4010
- **API**: http://localhost:4000/api/v1/health
- **Database**: localhost:5433
- **Redis**: localhost:6380

## 🎯 Test the Unified Design System

1. **Open** http://localhost:4010
2. **Click** "Customize" button
3. **Test** live color changes
4. **Toggle** visual effects
5. **Switch** terminology styles
6. **Verify** responsive design

## 🛠 Useful Commands

```bash
# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Check status
docker-compose ps

# Restart service
docker-compose restart web-dev

# Clean everything
docker-compose down -v --remove-orphans
```

## 🔧 Troubleshooting

### Port Conflicts
- Change ports in `docker-compose.dev.yml`
- Check: `netstat -tulpn | grep :4010`

### Build Issues
- Clean cache: `docker system prune -a`
- Rebuild: `docker-compose build --no-cache`

### Database Issues
- Reset: `docker-compose down -v`
- Restart: `docker-compose up postgres-dev`

## 📊 Health Checks

```bash
# API Health
curl http://localhost:4000/api/v1/health

# Database
docker-compose exec postgres-dev psql -U vulhub -d vulhub_dev

# Redis
docker-compose exec redis-dev redis-cli ping
```

## 🎨 Testing Checklist

- [ ] Website loads at http://localhost:4010
- [ ] Customization panel opens
- [ ] Live color changes work
- [ ] Visual effects toggle
- [ ] Typography changes apply
- [ ] Layout settings work
- [ ] Responsive design functions
- [ ] No console errors
- [ ] Mobile view works

---

**Full Documentation**: [DOCKER_TESTING_GUIDE.md](docs/DOCKER_TESTING_GUIDE.md)





