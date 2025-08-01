OS := $(shell uname)

ifeq ($(OS), Linux)
	VOLUMES_PATH := /home/npolack/data
else
	VOLUMES_PATH := $(shell pwd)/volumes
endif

all : colima volumes build
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml up -d
	open -a "Firefox" https://npolack.42.fr

volumes:
	@echo "Create volumes folder at $(VOLUMES_PATH)"
	@mkdir -p $(VOLUMES_PATH)/{mariadb,wordpress}
	@sudo chown -R $(whoami):staff /Users/ilia/Documents/42CC/inception/volumes
	@chmod -R 755 /Users/ilia/Documents/42CC/inception/volumes

colima:
	@echo "system is : $(OS)"
ifeq ($(OS), Darwin)
	colima start --mount /Users/ilia/Documents/42CC/inception/volumes:w --vm-type vz
endif

build: colima
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f build

build_bonus : colima
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml build

save:
	@if [ -d "${VOLUMES_PATH}/hazardous" ] && [ "$$(ls -A "${VOLUMES_PATH}/hazardous")" ]; then \
		echo "Save html files"; \
		rm -fr srcs/requirements/bonus/www/hazardous && cp -r "${VOLUMES_PATH}/hazardous" srcs/requirements/bonus/www/hazardous; \
	else \
		echo "Folder does not exist or is empty"; \
	fi

bonus : colima volumes build_bonus
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml up -d
	open -a "Firefox" https://hazardous.fr

stop :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml stop 

down :
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml -f srcs/docker-compose.bonus.yml down

nginx : 
	docker build -t nginx srcs/requirements/nginx/

mariadb : volumes
	docker build -t mariadb:ft42 srcs/requirements/mariadb
	docker run -it mariadb:ft42 --env-file srcs/.env -v $(VOLUMES_PATH)/mariadb:/var/lib/mysql mariadb

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
	rm -fr $(VOLUMES_PATH)
ifeq ($(OS), Darwin)
	colima stop && colima delete
endif

# docker exec -it my-nginx /bin/bash
