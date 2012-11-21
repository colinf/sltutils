
build: components index.js ages.js
	@component build -o public/build

components:
	@component install

clean:
	rm -fr public/build components

.PHONY: clean
