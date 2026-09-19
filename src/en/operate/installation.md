# Installing LCOJ with Docker

This guide walks you through installing LCOJ with Docker, the recommended and simplest approach.

**Repository:** [lcoj-docker](https://github.com/luyencode/lcoj-docker)

## System requirements

### Minimum hardware

- **CPU:** 2 cores
- **RAM:** 4GB
- **Disk:** 20GB free
- **OS:** Linux (Ubuntu 20.04+ recommended)

### Recommended hardware

- **CPU:** 4+ cores
- **RAM:** 8GB+
- **Disk:** 50GB+ SSD
- **Network:** 100Mbps+

### Software

- Docker 20.10+
- Docker Compose 2.0+
- Git

## Step 1: Install Docker

### Ubuntu/Debian

```sh
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add your user to the docker group
sudo usermod -aG docker $USER

# Log out and log back in for the change to take effect
```

### Verify

```sh
docker --version
docker compose version
```

## Step 2: Clone the repository

```sh
git clone --recursive https://github.com/luyencode/lcoj-docker.git
cd lcoj-docker/dmoj
```

**Note:** The `--recursive` flag is essential: it clones the submodules as well.

## Step 3: Initialize

Run the initialization script:

```sh
./scripts/initialize
```

This script:
- Creates the required directories
- Copies the sample configuration files
- Sets permissions

## Step 4: Configure

### 4.1. Create the environment files

```sh
cp environment/mysql-admin.env.example environment/mysql-admin.env
cp environment/mysql.env.example environment/mysql.env
cp environment/site.env.example environment/site.env
```

### 4.2. Configure MySQL

**File: `environment/mysql.env`**

```env
MYSQL_DATABASE=lcoj
MYSQL_USER=lcoj
MYSQL_PASSWORD=<strong_password>
```

**File: `environment/mysql-admin.env`**

```env
MYSQL_ROOT_PASSWORD=<strong_root_password>
```

**Note:** Replace `<strong_password>` with an actual password!

### 4.3. Configure the site

**File: `environment/site.env`**

```env
# Database
MYSQL_HOST=db
MYSQL_DATABASE=lcoj
MYSQL_USER=lcoj
MYSQL_PASSWORD=<same_as_mysql.env>

# Site
SITE_NAME=LCOJ
SITE_LONG_NAME=LuyenCode Online Judge
SITE_ADMIN_EMAIL=admin@luyencode.net

# Secret key (generate a new one)
SECRET_KEY=<long_random_secret_key>

# Host
HOST=luyencode.net

# Debug (MUST BE CHANGED TO False IN PRODUCTION)
DEBUG=True
```

**Generate a SECRET_KEY:**

```sh
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

### 4.4. Configure Nginx

**File: `nginx/conf.d/nginx.conf`**

Change `server_name`:

```nginx
server {
    listen 80;
    server_name luyencode.net;  # Change to your domain
    
    # ... leave the rest unchanged
}
```

## Step 5: Build the Docker images

```sh
docker compose build
```

This takes 10–20 minutes, depending on your network speed and machine.

## Step 6: Start the services

### 6.1. Start the database and cache

```sh
docker compose up -d db redis
```

Wait about 10 seconds for the database to finish starting up.

### 6.2. Start the site and Celery

```sh
docker compose up -d site celery
```

### 6.3. Create the database schema

```sh
./scripts/migrate
```

### 6.4. Generate static files

```sh
./scripts/copy_static
```

### 6.5. Load sample data

```sh
./scripts/manage.py loaddata navbar
./scripts/manage.py loaddata language_small
./scripts/manage.py loaddata demo
```

**Warning:** `demo` creates an admin account with username and password `admin`. Change it immediately after logging in!

### 6.6. Create a superuser

```sh
./scripts/manage.py createsuperuser
```

Follow the prompts to create your admin account.

## Step 7: Start all services

```sh
docker compose up -d
```

Check that all containers are running:

```sh
docker compose ps
```

You should see:

```
NAME              STATUS
lcoj_bridged      Up
lcoj_celery       Up
lcoj_mysql        Up
lcoj_nginx        Up
lcoj_redis        Up
lcoj_site         Up
lcoj_wsevent      Up
```

## Step 8: Verify

Open `http://localhost` (or your domain) to verify the installation.

You should see the LCOJ home page!

## Directory structure

```
dmoj/
├── base/              # Base Docker image
├── bridged/           # Bridge service
├── celery/            # Celery worker
├── config/            # Config files
├── database/          # MySQL data (created automatically)
├── environment/       # Environment variables
├── media/             # User uploads
├── nginx/             # Nginx config
├── problems/          # Problem data
├── repo/              # Site source code (submodule)
├── scripts/           # Helper scripts
├── site/              # Site Docker image
├── wsevent/           # WebSocket event server
└── docker-compose.yml # Docker Compose config
```

## Services

| Service | Container | Port | Description |
|---------|-----------|------|-------|
| nginx | lcoj_nginx | 80 | Web server |
| site | lcoj_site | - | Django application |
| celery | lcoj_celery | - | Background tasks |
| bridged | lcoj_bridged | 9998, 9999 | Judge bridge |
| wsevent | lcoj_wsevent | 15100-15102 | WebSocket events |
| db | lcoj_mysql | 3306 | MariaDB database |
| redis | lcoj_redis | 6379 | Cache & message broker |

## Managing services

### View logs

```sh
# All services
docker compose logs -f

# A specific service
docker compose logs -f site
docker compose logs -f celery
docker compose logs -f nginx
```

### Restart a service

```sh
docker compose restart site
docker compose restart celery
```

### Stop everything

```sh
docker compose down
```

### Start again

```sh
docker compose up -d
```

## Updating

### Update the code

```sh
cd lcoj-docker/dmoj
git pull
git submodule update --init --recursive
```

### Rebuild and restart

```sh
docker compose up -d --build site celery bridged wsevent
```

### Run migrations

```sh
./scripts/migrate
```

### Update static files

```sh
./scripts/copy_static
```

## Backup

### Back up the database

```sh
docker exec lcoj_mysql mysqldump -u root -p<root_password> lcoj > backup_$(date +%Y%m%d).sql
```

### Back up media files

```sh
tar -czf media_backup_$(date +%Y%m%d).tar.gz dmoj/media/
```

### Back up problems

```sh
tar -czf problems_backup_$(date +%Y%m%d).tar.gz dmoj/problems/
```

## Restore

### Restore the database

```sh
docker exec -i lcoj_mysql mysql -u root -p<root_password> lcoj < backup_20240101.sql
```

### Restore media

```sh
tar -xzf media_backup_20240101.tar.gz
```

## Monitoring

### Check resource usage

```sh
docker stats
```

### Check disk usage

```sh
docker system df
```

### Follow logs in real time

```sh
# Site logs
docker compose logs -f --tail=100 site

# Celery logs
docker compose logs -f --tail=100 celery

# Nginx access logs
docker compose exec nginx tail -f /var/log/nginx/access.log
```

## Troubleshooting

### Container won't start

```sh
# View logs
docker compose logs <service_name>

# View details
docker inspect <container_name>
```

### Database connection error

```sh
# Check that MySQL is running
docker compose ps db

# Check the logs
docker compose logs db

# Restart the database
docker compose restart db
```

### Static files not loading

```sh
# Re-run copy_static
./scripts/copy_static

# Restart nginx
docker compose restart nginx
```

### Out of memory

```sh
# Check memory usage
docker stats

# Raise the memory limit in docker-compose.yml
# Add to the relevant service:
deploy:
  resources:
    limits:
      memory: 2G
```

### Disk full

```sh
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Remove unused containers
docker container prune
```

## Production checklist

Before deploying to production:

- [ ] Set `DEBUG=False` in `site.env`
- [ ] Change the default `admin` password
- [ ] Configure HTTPS (SSL certificate)
- [ ] Set up automated backups
- [ ] Configure the firewall
- [ ] Set up monitoring (Prometheus, Grafana)
- [ ] Configure log rotation
- [ ] Test disaster recovery
- [ ] Document your custom changes

## Configuring HTTPS

### With Let's Encrypt

```sh
# Install certbot
apt install certbot python3-certbot-nginx

# Obtain a certificate
certbot --nginx -d luyencode.net

# Auto-renew
certbot renew --dry-run
```

### Update the nginx config

Certbot updates the nginx config automatically. Then run:

```sh
docker compose restart nginx
```

## Performance tuning

### Increase the number of Celery workers

**File: `celery/Dockerfile`**

```dockerfile
CMD celery -A dmoj_celery worker -l info --concurrency=4
```

### Increase the number of uWSGI workers

**File: `site/Dockerfile`**

```dockerfile
CMD uwsgi --ini uwsgi.ini --processes=4
```

### Configure Redis persistence

**File: `docker-compose.yml`**

```yaml
redis:
  command: redis-server --appendonly yes
  volumes:
    - redis-data:/data
```

## See also

- [Management Commands](/en/reference/management-commands)
- [Updating the system](/en/operate/updating)
- [Setting up a judge](/en/operate/judge-setup)
- [Managing problems](/en/setter/managing-problems)

## Support

If you run into problems:
1. Check the logs: `docker compose logs -f`
2. Open an issue on [GitHub Issues](https://github.com/luyencode/lcoj-docker/issues)
3. Contact support at [https://luyencode.net/about/#lien-he](https://luyencode.net/about/#lien-he)
