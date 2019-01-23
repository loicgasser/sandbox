
.PHONY: help
help:
	@echo "Usage: make <target>"
	@echo
	@echo "Possible targets:"
	@echo
	@echo "- all      Build the app in the current environment"
	@echo "- clean    Remove all generated build artefacts"

.PHONY: all
all:
	npm install
	cp -f $(addprefix node_modules/jquery/dist/, jquery.js jquery.min.js) src/lib/;
	cp -f $(addprefix node_modules/filesaverjs/, FileSaver.js FileSaver.min.js) src/lib/;
	cp -f $(addprefix node_modules/bootstrap/dist/js/, bootstrap.js bootstrap.min.js) src/lib/;
	cp -f $(addprefix node_modules/bootstrap/dist/css/, bootstrap.min.css bootstrap-theme.min.css) src/css/;

.PHONY: clean
clean:
	rm -rf node_modules
	rm -rf src/lib/*
	rm -rf src/css/bootstrap*
