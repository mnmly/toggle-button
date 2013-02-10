
build: components index.js toggle-button.css
	@component build --dev


%.css: %.styl
	@stylus --use nib $<
 
components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
