OS := $(shell uname)

VOLUMES_PATH := /home/$(USER)/data
DOCKER_GROUP_CHECK := $(shell groups | grep -q docker && echo "ok" || echo "missing")

all : volumes build
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml up -d

setup:
	sudo usermod -aG docker $(USER)
	newgrp docker

volumes:
	@echo "Create volumes folder at $(VOLUMES_PATH)"
	@mkdir -p $(VOLUMES_PATH)/mariadb
	@mkdir -p $(VOLUMES_PATH)/wordpress
	@mkdir -p $(VOLUMES_PATH)/node
	@mkdir -p $(VOLUMES_PATH)/node/uploads
	@sudo chown -R 1000:1000 $(VOLUMES_PATH)
	@sudo chmod -R 775 $(VOLUMES_PATH)

build:
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml build

build_bonus :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml build

bonus : volumes build_bonus
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml up -d

stop :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml stop 

down :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml down

nginx :
	docker build -t nginx srcs/requirements/nginx/

mariadb : volumes
	docker build -t mariadb:ft42 srcs/requirements/mariadb
	docker run -it mariadb:ft42 --env-file srcs/.env -v $(VOLUMES_PATH)/mariadb:/var/lib/mysql mariadb

ftp :
	docker build -t ftp:ft42 srcs/requirements/bonus/ftp

wordpress :
	docker build -t wordpress:ft42 srcs/requirements/wordpress

redis :
	docker build -t redis:ft42 srcs/requirements/bonus/redis

re : fclean all

rebonus : fclean bonus

clean :
	@if [ -n "$$(docker ps -q)" ]; then docker stop $$(docker ps -q); else echo "No running containers to stop."; fi
	@if [ -n "$$(docker ps -aq)" ]; then docker rm -f $$(docker ps -aq); else echo "No running containers to remove."; fi
	@if [ -n "$$(docker images -q)" ]; then docker rmi -f $$(docker images -q); else echo "No images to remove."; fi
	@if [ -n "$$(docker volume ls -q)" ]; then docker volume rm $$(docker volume ls -q); else echo "No volumes to remove."; fi

fclean: clean
	docker system prune -a --volumes --force
	docker network prune
	sudo rm -fr $(VOLUMES_PATH)

# Quick fix for immediate use (run this if you get permission denied)
fix_docker_permissions:
ifeq ($(OS), Linux)
	@echo "Quick fix: Running newgrp docker to activate group membership"
	@echo "This will start a new shell with docker group activated"
	newgrp docker
endif

