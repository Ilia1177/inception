OS := $(shell uname)

ifeq ($(OS), Linux)
	VOLUMES_PATH := /home/npolack/data
else
	VOLUMES_PATH := $(shell pwd)/volumes
endif


all :
	@echo "Using volume path: $(VOLUMES_PATH)"
	HOST_VOLUME_PATH=$(VOLUMES_PATH) docker compose -f srcs/docker-compose.yml up -d

stop :
	sudo docker compose -f srcs/docker-compose.yml stop 

nginx : 
	docker build -t nginx srcs/requirements/nginx/

mariadb :
	docker build -t mariadb srcs/requirements/mariadb

wordpress :
	docker build -t wordpress srcs/requirements/wordpress

down :
	docker compose -f srcs/docker-compose.yml down

clean :
	@if [ -n "$$(docker ps -q)" ]; then docker stop $$(docker ps -q); else echo "No running containers to stop."; fi
	@if [ -n "$$(docker ps -aq)" ]; then docker rm $$(docker ps -aq); else echo "No running containers to remove."; fi
	@if [ -n "$$(docker images -q)" ]; then docker rmi $$(docker images -q); else echo "No images to remove."; fi
	@if [ -n "$$(docker volume ls -q)" ]; then docker volume rm $$(docker volume ls -q); else echo "No volumes to remove."; fi

fclean: clean
	rm -fr $(VOLUMES_PATH)
	docker system prune -a --volumes --force
	docker network prune


# docker exec -it my-nginx /bin/bash
