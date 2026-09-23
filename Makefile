DOCKER       := docker compose
DOCKER_PROD  := docker compose -f docker-compose.prod.yml

.PHONY: dev dev-up dev-down dev-build dev-logs prod prod-up prod-down prod-build prod-logs \
        up build ps logs down stop migrate shell createsuperuser destroy

dev: dev-up

dev-up:
	$(DOCKER) up -d --build

dev-down:
	$(DOCKER) down

dev-build:
	$(DOCKER) build

dev-logs:
	$(DOCKER) logs -f --tail=100

prod: prod-up

prod-up:
	$(DOCKER_PROD) up -d --build

prod-down:
	$(DOCKER_PROD) down

prod-build:
	$(DOCKER_PROD) build

prod-logs:
	$(DOCKER_PROD) logs -f --tail=100

up: dev-up

build: dev-build

ps:
	$(DOCKER) ps

logs: dev-logs

down: dev-down

stop:
	$(DOCKER) stop

migrate:
	$(DOCKER) exec backend python manage.py migrate

shell:
	$(DOCKER) exec -it backend python manage.py shell

createsuperuser:
	$(DOCKER) exec -it backend python manage.py createsuperuser

destroy:
	$(DOCKER) down -v