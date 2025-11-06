OS := $(shell uname)

VOLUMES_PATH := /home/$(USER)/data
DOCKER_GROUP_CHECK := $(shell groups | grep -q docker && echo "ok" || echo "missing")

all : build
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml up -d

bonus : build_bonus
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml up -d

build: volumes
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml build

build_bonus : volumes_bonus
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml build

setup:
	sudo usermod -aG docker $(USER)
	newgrp docker

volumes_bonus:
	@echo "Create volumes folder at $(VOLUMES_PATH)"
	@mkdir -p $(VOLUMES_PATH)/redis
	@mkdir -p $(VOLUMES_PATH)/node/uploads
	@mkdir -p $(VOLUMES_PATH)/node/public
	@sudo chown -R 1000:1000 $(VOLUMES_PATH)
	@sudo chmod -R 775 $(VOLUMES_PATH)

volumes:
	@echo "Create volumes folder at $(VOLUMES_PATH)"
	@mkdir -p $(VOLUMES_PATH)/mariadb
	@mkdir -p $(VOLUMES_PATH)/wordpress
	@sudo chown -R 1000:1000 $(VOLUMES_PATH)
	@sudo chmod -R 775 $(VOLUMES_PATH)

stop :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml stop 

down :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml down

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
