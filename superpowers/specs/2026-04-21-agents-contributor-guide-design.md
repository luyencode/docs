# AGENTS Contributor Guide Design

Date: 2026-04-21

## Goal

Create AI-agent-focused contributor guides for the Luyencode workspace so agents can work in the correct environment, run the right Docker and Django commands, and avoid production-impacting mistakes.

## Scope

The implementation will create or refine these files:

- `/home/hieu/workspaces/luyencode/AGENTS.md`
- `/home/hieu/workspaces/luyencode/lcoj-docker/AGENTS.md`
- `/home/hieu/workspaces/luyencode/dev-lcoj-docker/AGENTS.md`

The root guide is a workspace router. The environment guides are self-contained operational references for agents that start inside either repository.

## Environment Model

The workspace has two LCOJ Docker environments:

- `lcoj-docker`: production environment for `https://luyencode.net`.
- `dev-lcoj-docker`: development environment for `https://dev.luyencode.net`.

Both environments run the Django-based LCOJ platform through Docker Compose. Public traffic reaches each environment through Cloudflare Tunnel. Inside each compose stack, nginx serves HTTP and proxies to the Django/uWSGI site and WebSocket event server.

Production must be treated as sensitive. Agents should use `dev-lcoj-docker` for experimentation and validation by default, and should not restart production services, deploy, migrate, or touch production data unless the user explicitly requests that action.

## Chosen Approach

Use a root router plus mirrored environment guides.

The root `AGENTS.md` will identify the workspace, describe the production and development directory split, explain shared architecture, and state safety defaults. It will point agents to the nearest environment guide for concrete commands.

Each environment `AGENTS.md` will keep the same section structure so agents can compare them quickly, but will include environment-specific domains, container names, bridged ports, and nginx defaults.

This balances discoverability with drift control: agents get enough context from the root, but each environment remains usable when opened directly.

## Guide Structure

Each guide should be concise and operational, with these sections:

- Identity and scope.
- Environment map.
- Architecture summary.
- Key directories.
- Command rules.
- Change workflow.
- Validation and debugging.
- Style and code conventions.
- Safety rules.

The guides should avoid human onboarding narrative. They should prioritize instructions that prevent common agent mistakes.

## Architecture Content

The guides will document the shared LCOJ stack:

- `nginx`: reverse proxy and static/media serving.
- `site`: Django app running under uWSGI.
- `celery`: background task worker.
- `db`: MariaDB database.
- `redis`: cache and Celery broker.
- `wsevent`: WebSocket event server.
- `bridged`: connector between the Django site and judge servers.

They will state that Django application code lives in `dmoj/repo/`, a git submodule pointing at `lcoj-site`, and that Docker commands should be run from `dmoj/`.

## Environment-Specific Facts

The production guide will document:

- Domain: `https://luyencode.net`.
- Directory: `/home/hieu/workspaces/luyencode/lcoj-docker`.
- Container prefix: `lcoj_`.
- Bridged host ports: `9998` and `9999`.
- Compose nginx default: `${NGINX_PORT:-8071}:80`.

The development guide will document:

- Domain: `https://dev.luyencode.net`.
- Directory: `/home/hieu/workspaces/luyencode/dev-lcoj-docker`.
- Container prefix: `lcoj_dev_`.
- Bridged host ports: `19998` and `19999`.
- Compose nginx default: `${NGINX_PORT:-80}:80`.

## Command Contract

All Docker Compose commands run from the relevant `dmoj/` directory.

Common commands to document:

- `docker compose ps`
- `docker compose logs -f <service>`
- `docker compose restart site celery`
- `docker compose restart nginx`
- `docker compose up -d`
- `docker compose up -d --build base site celery bridged wsevent`
- `./scripts/manage.py <command>`
- `./scripts/migrate`
- `./scripts/copy_static`
- `./scripts/enter_site`

Change workflow rules:

- Python/Django code changes usually require `docker compose restart site celery`.
- Static, SCSS, or JavaScript changes require `./scripts/copy_static`, then nginx restart if served assets need refresh.
- Model changes require `./scripts/manage.py makemigrations`, review of generated migrations, then `./scripts/migrate`.
- Dependency or Dockerfile changes require rebuilding relevant images.

## Validation

The guides will instruct agents to prefer targeted validation:

- Run specific Django tests with `./scripts/manage.py test <module-or-test>`.
- Check service state with `docker compose ps`.
- Inspect logs with `docker compose logs -f site`, `celery`, `nginx`, `bridged`, or `wsevent`.
- Validate static changes with `./scripts/copy_static`.

When tests or Docker commands are not run, agents should state that clearly in their final response.

## Safety Rules

The guides will include these safety rules:

- Never commit secrets or environment files.
- Do not hardcode secrets or deployment-specific values in Django code.
- Preserve git submodule boundaries.
- Do not edit generated database data, media, or problem data unless explicitly requested.
- Do not run production-impacting actions in `lcoj-docker` without explicit user approval.
- Keep changes focused; avoid unrelated refactors.

## Out Of Scope

The guides will not include a full installation tutorial, Cloudflare Tunnel setup instructions, judge server provisioning, or human contributor policy. Existing README files remain the place for installation walkthroughs.

## Review Criteria

The implementation is complete when:

- The root guide clearly routes agents between production and development.
- Both environment guides are self-contained and aligned in structure.
- Production and development differences are explicit.
- Commands match the Docker Compose files in each environment.
- The guides are concise enough for agents to read quickly.
