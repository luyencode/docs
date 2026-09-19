# uWSGI

**Important:** This page applies only to bare-metal installations (without Docker). 

**If you use Docker (recommended), see [Installing with Docker](/en/operate/installation).**

---

uWSGI is the application server that runs Django, replacing `runserver` in production.

## Installation

uWSGI is installed as part of [setting up the site](/en/operate/installation).

If it is missing:

```sh
source lcojsite/bin/activate
pip3 install uwsgi
```

## Configuration

### The uwsgi.ini file

Create a `uwsgi.ini` file in the site directory:

```ini
[uwsgi]
# Django project
chdir = /home/lcoj/site
module = dmoj.wsgi:application

# Virtual environment
home = /home/lcoj/lcojsite

# Process
master = true
processes = 4
threads = 2

# Socket
socket = /tmp/lcoj-site.sock
chmod-socket = 666
vacuum = true

# Logging
logto = /var/log/uwsgi/lcoj-site.log

# Performance
max-requests = 5000
harakiri = 60
```

**Explanation:**
- `chdir`: Project directory
- `module`: WSGI module
- `home`: Virtual environment
- `processes`: Number of worker processes
- `threads`: Number of threads per process
- `socket`: Unix socket that nginx connects to
- `max-requests`: Restart a worker after N requests
- `harakiri`: Timeout (seconds)

### Create the log directory

```sh
mkdir -p /var/log/uwsgi
chown lcoj:lcoj /var/log/uwsgi
```

## Running with Supervisor

File `/etc/supervisor/conf.d/site.conf`:

```ini
[program:site]
command=/home/lcoj/lcojsite/bin/uwsgi --ini /home/lcoj/site/uwsgi.ini
directory=/home/lcoj/site
user=lcoj
autostart=true
autorestart=true
redirect_stderr=true
stdout_logfile=/var/log/uwsgi/site-supervisor.log
```

Start it:

```sh
supervisorctl update
supervisorctl start site
```

## Nginx configuration

Nginx config file:

```nginx
upstream lcoj {
    server unix:///tmp/lcoj-site.sock;
}

server {
    listen 80;
    server_name luyencode.net;
    
    location / {
        uwsgi_pass lcoj;
        include uwsgi_params;
    }
    
    location /static/ {
        alias /home/lcoj/site/staticfiles/;
    }
    
    location /media/ {
        alias /home/lcoj/site/media/;
    }
}
```

Reload nginx:

```sh
service nginx reload
```

## Optimization

### Number of processes

Formula: `processes = (CPU cores × 2) + 1`

Example: 4 cores → 9 processes

```ini
processes = 9
```

### Threads

Increase threads for I/O-heavy workloads:

```ini
threads = 4
```

### Buffer size

Increase it if you handle large requests:

```ini
buffer-size = 32768
```

### Lazy apps

Load the app after forking (saves RAM):

```ini
lazy-apps = true
```

### Offload

Offload static files:

```ini
offload-threads = 4
```

## Monitoring

### Stats server

Add to `uwsgi.ini`:

```ini
stats = 127.0.0.1:9191
```

View stats:

```sh
uwsgitop 127.0.0.1:9191
```

Install uwsgitop:

```sh
pip3 install uwsgitop
```

### Log

Follow the log in real time:

```sh
tail -f /var/log/uwsgi/lcoj-site.log
```

Or via Supervisor:

```sh
supervisorctl tail -f site
```

## Troubleshooting

**uWSGI won't start:**
- Check the `uwsgi.ini` syntax
- Check the paths
- View the log: `supervisorctl tail -f site`

**502 Bad Gateway:**
- Check that uWSGI is running
- Check that the socket file exists: `ls -la /tmp/lcoj-site.sock`
- Check the socket permissions

**Slow response:**
- Increase `processes` and `threads`
- Check database performance
- Check the `harakiri` timeout

**Memory leak:**
- Lower `max-requests`
- Check the code for leaks
- Restart periodically

## Reload

### Graceful reload

No downtime:

```sh
supervisorctl restart site
```

Or:

```sh
touch /home/lcoj/site/uwsgi.ini
```

### Force reload

```sh
killall -9 uwsgi
supervisorctl start site
```

## Notes

- Do not use `runserver` in production
- Monitor RAM and CPU usage
- Back up your config before changing it
- Test on staging before deploying to production
