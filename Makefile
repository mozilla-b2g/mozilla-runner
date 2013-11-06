.PHONY: test
test: test/fixtures/firefox
	node setup.js
	./node_modules/mocha/bin/mocha --ui tdd -t 30s

test/fixtures:
	mkdir test/fixtures

node_modules: package.json
	npm install

test/fixtures/firefox: node_modules
	./node_modules/.bin/mozilla-download \
		--product firefox \
		$@

.PHONY: ci
ci:
	nohup Xvfb :99 &
	DISPLAY=:99 make test

.PHONY: server
server:
	./node_modules/node-static/bin/cli.js -p 60028
