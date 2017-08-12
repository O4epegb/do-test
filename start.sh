docker build -t do-test-docker .
docker run -d -p 8080:3000 -e TEST_ENV=lol do-test-docker
