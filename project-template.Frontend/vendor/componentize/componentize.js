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

		setEventHandler(togglesElement);

		return togglesElement
	}

	function setEventHandler(element) {
		element.addEventListener('click', (event) => {
			const target = event.target;
			if (target.nodeName !== 'INPUT') { return }
			const value = target.value;
			const componentWrapper = element.parentNode;
			const component = componentWrapper.firstElementChild;

			if (target.type === 'radio') {
				setState(component, value);
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

	function setState(element, newState) {
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
					const matched = document.querySelectorAll(`[data-title*="${query}" i]`);
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

	window.addEventListener('DOMContentLoaded', () => {
		const componentsWrapper = document.querySelector('.components');

		if (componentsWrapper) {
			const filter = componentFilter(componentsWrapper);
			const components = componentsWrapper.querySelectorAll('.component');
			const toc = tableOfContents(Array.from(components));
			componentsWrapper.appendChild(toc);
			componentsWrapper.insertBefore(filter, componentsWrapper.firstElementChild);
		}
	});

})();
