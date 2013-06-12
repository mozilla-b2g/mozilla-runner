.PHONY: test
test:
	node setup.js
	./node_modules/mocha/bin/mocha --ui tdd -t 30s


.PHONY: ci
ci:
	nohup Xvfb :99 &
	DISPLAY=:99 make test

.PHONY: server
server:
	./node_modules/node-static/bin/cli.js -p 60028
