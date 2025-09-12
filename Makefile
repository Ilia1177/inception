OS := $(shell uname)

VOLUMES_PATH := /home/$(USER)/data
DOCKER_GROUP_CHECK := $(shell groups | grep -q docker && echo "ok" || echo "missing")

all : setup_docker volumes build
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml up -d

setup_docker:
	export UID=$(id -u)
	export GID=$(id -g)
	sudo usermod -aG docker $USER
	newgrp docker

setup_docker2:
	@echo "Setting up Docker for Linux..."
	@echo "Checking Docker installation..."
	@which docker > /dev/null || (echo "Docker not found. Please install Docker first." && exit 1)
	@echo "Checking Docker service..."
	@sudo systemctl is-active docker > /dev/null || sudo systemctl start docker
	@echo "Checking Docker group membership..."
	@if [ "$(DOCKER_GROUP_CHECK)" != "ok" ]; then \
		echo "Adding user to docker group..."; \
		sudo usermod -aG docker $(USER); \
		echo ""; \
		echo "IMPORTANT: You need to log out and log back in (or run 'newgrp docker')"; \
		echo "for the group changes to take effect, then run 'make all' again."; \
		echo ""; \
		echo "Alternatively, you can run: newgrp docker"; \
		echo "Then run 'make all' in the new shell."; \
		exit 1; \
	fi
	@echo "Docker setup complete for Linux"

volumes:
	@echo "Create volumes folder at $(VOLUMES_PATH)"
	@mkdir -p $(VOLUMES_PATH)/mariadb
	@mkdir -p $(VOLUMES_PATH)/wordpress
	@mkdir -p $(VOLUMES_PATH)/node
	@sudo chown -R 1000:1000 $(VOLUMES_PATH)

build: setup_docker
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml build

build_bonus : setup_docker
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml build

bonus : setup_docker volumes build_bonus
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml up -d

stop :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml stop 

down :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml down

nginx : setup_docker
	docker build -t nginx srcs/requirements/nginx/

mariadb : setup_docker volumes
	docker build -t mariadb:ft42 srcs/requirements/mariadb
	docker run -it mariadb:ft42 --env-file srcs/.env -v $(VOLUMES_PATH)/mariadb:/var/lib/mysql mariadb

ftp : setup_docker
	docker build -t ftp:ft42 srcs/requirements/bonus/ftp

wordpress : setup_docker
	docker build -t wordpress:ft42 srcs/requirements/wordpress

redis : setup_docker
	docker build -t redis:ft42 srcs/requirements/bonus/redis

re : fclean all

rebonus : fclean bonus

clean : setup_docker
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

