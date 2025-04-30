# Пути к папкам микросервисов
AUTH_SERVICE_DIR=auth-service
QUIZ_SERVICE_DIR=quiz-service
GEO_SERVICE_DIR=geo-service
WORLD_QUIZ_DIR=world-quiz

# Имена образов
AUTH_IMAGE=auth-service
QUIZ_IMAGE=quiz-service
GEO_IMAGE=geo-service
WORLD_IMAGE=world-quiz

# Сборка всех сервисов
build:
	docker build -t $(AUTH_IMAGE):latest $(AUTH_SERVICE_DIR)
	docker build -t $(QUIZ_IMAGE):latest $(QUIZ_SERVICE_DIR)
	docker build -t $(GEO_IMAGE):latest $(GEO_SERVICE_DIR)
	docker build -t $(WORLD_IMAGE):latest $(WORLD_QUIZ_DIR)

# Загрузка образов в Minikube
load:
	minikube image load $(AUTH_IMAGE):latest
	minikube image load $(QUIZ_IMAGE):latest
	minikube image load $(GEO_IMAGE):latest
	minikube image load $(WORLD_IMAGE):latest

# Применение всех YAML манифестов
deploy:
	kubectl apply -f k8s/

# Перезапуск деплойментов без пересборки
restart:
	kubectl rollout restart deployment/auth-service -n quiz-project
	kubectl rollout restart deployment/quiz-service -n quiz-project
	kubectl rollout restart deployment/geo-service -n quiz-project
	kubectl rollout restart deployment/world-quiz -n quiz-project

# Полный процесс: build + load + deploy
all: build load deploy

# Полная пересборка: удаление деплойментов + build + load + deploy
redeploy:
	kubectl delete deployment auth-service -n quiz-project --ignore-not-found
	kubectl delete deployment quiz-service -n quiz-project --ignore-not-found
	kubectl delete deployment geo-service -n quiz-project --ignore-not-found
	kubectl delete deployment world-quiz -n quiz-project --ignore-not-found
	make build
	make load
	make deploy
