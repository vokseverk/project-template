(function () {
	'use strict';

	function createModifierSwitches(componentWrapper) {
		const togglesElement = document.createElement('fieldset');
		togglesElement.classList.add('component-states-modifiers');

		const legend = document.createElement('legend');
		legend.textContent = 'States & Modifiers';

		togglesElement.appendChild(legend);
		const innerComponent = componentWrapper.firstElementChild;

		const identifier = getIdentifierFromName(componentWrapper.dataset.title);

		const states = componentWrapper.dataset.states?.split(',');
		const modifiers = componentWrapper.dataset.modifiers?.split(',');

		if (modifiers) {
			const wrapper = document.createElement('div');
			modifiers.forEach((modifier) => {
				const field = document.createElement('div');
				const input = document.createElement('input');
				input.type = 'checkbox';
				input.name = `mod-${modifier}`;
				input.value = modifier;
				input.id = `${identifier}-mod-${modifier}`;
				input.checked = innerComponent.classList.contains(modifier);

				const label = document.createElement('label');
				label.htmlFor = input.id;
				label.textContent = modifier;

				field.appendChild(input);
				field.appendChild(label);

				wrapper.appendChild(field);
			});

			togglesElement.appendChild(wrapper);
		}

		if (states) {
			const wrapper = document.createElement('div');
			states.forEach((state, index) => {
				const field = document.createElement('div');
				const input = document.createElement('input');
				input.type = 'radio';
				input.name = `${identifier}-state`;
				input.value = state;
				input.id = `${identifier}-state-${state}`;
				input.checked = innerComponent.classList.contains(state) || index == 0;

				const label = document.createElement('label');
				label.htmlFor = input.id;
				label.textContent = (state == 'nil' ? '(none)' : state);

				field.appendChild(input);
				field.appendChild(label);

				wrapper.appendChild(field);
			});

			togglesElement.appendChild(wrapper);
		}

		setEventHandler$1(togglesElement);

		return togglesElement
	}

	function setEventHandler$1(element) {
		element.addEventListener('click', (event) => {
			const target = event.target;
			if (target.nodeName !== 'INPUT') { return }
			const value = target.value;
			const componentWrapper = element.parentNode;
			const component = componentWrapper.firstElementChild;

			if (target.type === 'radio') {
				setState$1(component, value);
			} else {
				component.classList.toggle(value);
			}
		});
	}

	function getIdentifierFromName(name) {
		let identifier = name.toLowerCase().replaceAll(/\s+/g, '-');
		identifier = identifier.replaceAll(/[()%&?]/g, '');
		return identifier
	}

	function setState$1(element, newState) {
		const states = element.parentNode.dataset.states.split(',');
		states.forEach((state) => {
			if (state !== 'nil') {
				element.classList.remove(state);
			}
		});
		if (newState !== 'nil') {
			element.classList.add(newState);
		}
	}

	function tableOfContents(items) {
		// Fork off if we're using the legacy version
		if (items[0].nodeName != 'COMPONENT-VIEWER') {
			return tableOfContents_Legacy(items)
		}

		items.sort((a, b) => a.name > b.name ? 1 : -1);

		const tocElement = document.createElement('section');
		tocElement.classList.add('components-toc');
		const entries = [ '<ul>' ];
		items.forEach((component) => {
			entries.push(`<li><a href="#${component.id}">${component.name}</a></li>`);
		});

		entries.push('</ul>');
		tocElement.innerHTML = entries.join('\n');
		return tocElement
	}

	function tableOfContents_Legacy(items) {
		items.sort((a, b) => a.dataset.title > b.dataset.title ? 1 : -1);
		const tocElement = document.createElement('section');
		tocElement.classList.add('components-toc');
		const entries = [ '<ul>' ];
		items.forEach((component) => {
			const states = component.dataset.states;
			const modifiers = component.dataset.modifiers;
			if (states || modifiers) {
				component.appendChild(createModifierSwitches(component));
			}
			const componentID = component.getAttribute('id');
			const componentName = component.dataset.title;
			const componentLink = componentID || componentName.replace(/\s+/g, '-');
			entries.push(`<li><a href="#${componentLink}">${componentName}</a></li>`);
			if (!componentID) {
				component.setAttribute('id', componentLink);
			}
		});

		entries.push('</ul>');
		tocElement.innerHTML = entries.join('\n');
		return tocElement
	}

	const MATCHING_CLASS = 'matched';
	const FILTERING_CLASS = 'filtered';
	const KEY_ESC = 27;

	function componentFilter(wrapper) {
		const componentsFilter = document.createElement('div');
		componentsFilter.classList.add('components-filter');

		const label = document.createElement('label');
		label.htmlFor = 'components-filter';
		label.textContent = 'Filter components';

		const input = document.createElement('input');
		input.id = 'components-filter';
		input.type = 'text';
		input.placeholder = "E.g. 'gallery'";
		input.addEventListener('keyup', (event) => {
			const currentlyMatching = Array.from(document.querySelectorAll(`.${MATCHING_CLASS}`));
			if (event.keyCode === KEY_ESC || input.value === '') {
				wrapper.classList.remove(FILTERING_CLASS);
				input.value = '';
				currentlyMatching.forEach(component => component.classList.remove(MATCHING_CLASS));
			} else {
				const query = event.target.value;
				if (query.length > 2) {
					currentlyMatching.forEach(component => component.classList.remove(MATCHING_CLASS));
					wrapper.classList.add(FILTERING_CLASS);
					const matched = document.querySelectorAll(`[label*="${query}" i]`);
					if (matched) {
						Array.from(matched).forEach(component => component.classList.add(MATCHING_CLASS));
					}
				}
			}
		});

		componentsFilter.appendChild(label);
		componentsFilter.appendChild(input);
		return componentsFilter
	}

	class ComponentViewer extends HTMLElement {
		connectedCallback() {
			this.attachShadow({ mode: 'open' });
			this.setAttribute('id', this.id);

			this.shadowRoot.appendChild(this.styles);
			this.shadowRoot.appendChild(this.template);

			setEventHandler(this);
		}

		get states() {
			return this.getAttribute('states')?.split(',') ?? [ ]
		}

		get modifiers() {
			return this.getAttribute('modifiers')?.split(',') ?? [ ]
		}

		get sizeController() {
			return this.querySelector('#size-controller')
		}

		get innerComponent() {
			return this.firstElementChild
		}

		get name() {
			return this.getAttribute('label')
		}

		get id() {
			let idAttribute = this.name.toLowerCase();
			idAttribute = idAttribute.replaceAll(/\s+/g, '-');
			idAttribute = idAttribute.replaceAll(/[^a-z0-9-]/g, '');
			return idAttribute
		}

		get styles() {
			const styleSheet = document.createElement('style');
			styleSheet.textContent = `:host {
			--component-border-color: rgba(0 0 0 / 10%);
			--component-solid-bg-color: rgba(80, 80, 80);
			--controls-opacity: 0.1;
			--component-size: 100;

			transition: border-color 200ms ease-in;
			display: flex;
			flex-direction: column;
			gap: 0;
			border: 2px solid var(--component-border-color);
			padding: 0;
			margin-block: 4rem;
			border-radius: 8px;
			overflow: clip;
			background: rgba(0 0 0 / 5%);
		}

		:host(:hover),
		:host(:focus-within) {
			--component-border-color: rgba(0 0 0 / 90%);
			--controls-opacity: 1;
		}

		.component {
			background: white;
		}

		::slotted(*) {
			box-sizing: border-box;
			inline-size: calc(var(--component-size, 100) * 1%);
		}

		:host([background="transparent"]) .component {
			transition: background-color 0.5s linear;
			padding: 25px;
			background: rgba(255, 144, 192, 0.15) url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAYAAACtWK6eAAACKElEQVR4nO3VoRHEMBAEQcn1gX3+SZ2p0FAZdEewZGr3Wuu/+IyZuT2Bw3N7AHyZQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBIJAIAgEgkAgCASCQCAIBMJvZm5v4LD3vj2BgweBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoEgEAgCgSAQCAKBIBAIAoHwAvXgB8+uySnZAAAAAElFTkSuQmCC') left top;
			background-size: 18px;
			border-radius: 0;
		}
		:host([background="transparent"]) .component:hover {
			background-color: #ff90c0;
		}

		:host([background="solid"]) .component {
			background: var(--component-solid-bg-color);
		}

		header {
			display: flex;
			justify-content: space-between;
			padding-inline: 1rem;
		}

		h2 {
			font-size: 0.75rem;
			font-weight: normal;
			font-family: Inconsolata, Andale Mono, monospace, sans-serif;
			display: block;
			align-self: center;
		}

		.controls label { cursor: pointer; }
		.controls, .component {
			transition: border-color 200ms ease-in;
			border-block-start: 2px solid var(--component-border-color, black);
			padding: 1rem;
		}

		.controls fieldset { display: flex; gap: 2em; border: none; font-family: monospace; opacity: var(--controls-opacity, 1); transition: opacity 200ms ease-in; }
		.controls state-controller > div { display: flex; gap: 0.5em }
		.controls .sizer { margin-inline-start: auto; }
		`;

			return styleSheet
		}

		get template() {
			const templateElement = document.createElement('template');
			let html = `<header><h2 class="title">${this.name}</h2><input id="size-controller" class="sizer" type="range" min="25" max"100" value="100" step="25"></header>`;
				html += `<article class="component"><slot></slot></article>`;
			if (this.modifiers.length || this.states.length) {
				html += `<section class="controls"><fieldset><legend>States & modifiers</legend>`;
				html += this.modifiers.length > 0 ? `<state-controller for="${this.id}" states="${this.modifiers.join(',')}" selected="${this.selectedModifiers}" is-multiple></state-controller>` : '';
				html += this.states.length > 0 ? `<state-controller for="${this.id}" states="${this.states.join(',')}" selected="${this.selectedState}"></state-controller>` : '';
				html += `</fieldset></section>`;
			}

			templateElement.innerHTML = html;

			return templateElement.content
		}

		get selectedModifiers() {
			return this.modifiers.filter(m => this.innerComponent.classList.contains(m)).join(',')
		}

		get selectedState() {
			return this.states.filter(s => this.innerComponent.classList.contains(s))[0]
		}
	}

	function setEventHandler(element) {
		const controls = element.shadowRoot.querySelector('.controls');
		const header = element.shadowRoot.querySelector('header');

		if (controls != null) {
			controls.addEventListener('click', (event) => {
				const target = event.target;
				if (target.nodeName !== 'INPUT') { return }
				const value = target.value;
				const componentWrapper = element.closest('component-viewer');
				const component = componentWrapper.firstElementChild;


				if (target.type === 'radio') {
					setState(component, value);
				} else if (target.type === 'checkbox') {
					component.classList.toggle(value);
				}
			});
		}

		if (header != null) {
			header.addEventListener('mousemove', (event) => {
				if (event.target.type === 'range') {
					const value = event.target.value;
					element.style.setProperty('--component-size', value);
				}
			});
		}
	}

	function setState(element, newState) {
		const states = element.parentNode.states;
		states.forEach((state) => {
			if (state !== 'nil') {
				element.classList.remove(state);
			}
		});
		if (newState !== 'nil') {
			element.classList.add(newState);
		}
	}

	function registerElement$1() {
		customElements.define('component-viewer', ComponentViewer);
	}

	class StateController extends HTMLElement {
		constructor() {
			super();
		}

		// <state-controller for="component-name" states="nil,one,far-fetched" selected="" is-multiple></state-controller>
		//
		// <state-controller for="component-name" states="nil,one,far-fetched" selected=""></state-controller>
		//

		connectedCallback() {
			const isMultiple = this.hasAttribute('is-multiple');

			const identifier = this.componentName;
			const states = this.states;

			const wrapper = document.createElement('div');
			wrapper.style = 'display: flex; align-items: center; gap: 1em;';
			states.forEach((state, index) => {
				const field = document.createElement('div');
				const input = document.createElement('input');

				input.value = state;

				if (isMultiple) {
					input.type = 'checkbox';
					input.switch = true;
					input.name = `mod-${state}`;
					input.id = `${identifier}-mod-${state}`;
					input.checked = this.selected.includes(state);
				} else {
					input.type = 'radio';
					input.name = `${identifier}-state`;
					input.id = `${identifier}-state-${state}`;
					input.checked = this.selected == state || index == 0;
				}

				const label = document.createElement('label');
				label.htmlFor = input.id;
				label.textContent = isMultiple ? state : (state == 'nil' ? '(none)' : state);

				field.style = 'display: flex; align-items: center; gap: 0.5em;';
				field.appendChild(input);
				field.appendChild(label);

				wrapper.appendChild(field);
			});

			this.appendChild(wrapper);
		}

		get componentName() {
			return this.getAttribute('for') ?? 'generated-name'
		}

		get states() {
			return this.getAttribute('states')?.split(',') ?? [ ]
		}

		get selected() {
			return this.getAttribute('selected')?.split(',') ?? [ ]
		}
	}

	function registerElement() {
		customElements.define('state-controller', StateController);
	}

	window.addEventListener('DOMContentLoaded', () => {
		registerElement$1();
		registerElement();

		const componentsWrapper = document.querySelector('.components');
		const componentViewers = document.querySelectorAll('component-viewer');

		const bodyElement = document.querySelector('body');

		if (componentsWrapper) {
			const filter = componentFilter(componentsWrapper);
			const toc = tableOfContents(Array.from(componentViewers));

			componentsWrapper.insertBefore(filter, componentsWrapper.firstElementChild);
			bodyElement.appendChild(toc);
		}
	});

})();
