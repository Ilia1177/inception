
ALL_CONTAINER =

all :
	mkdir -p /Users/ilia/docker-data/wordpress
	mkdir -p /Users/ilia/docker-data/mariadb
	chmod 755 /Users/ilia/docker-data/wordpress
	chmod 755 /Users/ilia/docker-data/mariadb
	chown -R $$(whoami):staff /Users/ilia/docker-data/wordpress
	chown -R $$(whoami):staff /Users/ilia/docker-data/wordpress
	sudo docker compose -f srcs/docker-compose.yml up -d

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
	rm -fr /Users/ilia/docker-data/mariadb
	rm -fr /Users/ilia/docker-data/wordpress
	docker system prune -a --volumes --force
	docker network prune


# docker exec -it my-nginx /bin/bash
