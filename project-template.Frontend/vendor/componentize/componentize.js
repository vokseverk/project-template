'use strict';

(function () {
  (function () {
    var component, componentID, componentLink, componentName, components, entries, i, items, len, tocElement;
    components = document.querySelector('.components');
    if (components != null) {
      items = Array.from(components.querySelectorAll('.component')).sort(function (a, b) {
        return a.dataset.title > b.dataset.title;
      });
      tocElement = document.createElement('section');
      tocElement.classList.add('components-toc');
      entries = ['<ul>'];
      for (i = 0, len = items.length; i < len; i++) {
        component = items[i];
        componentID = component.getAttribute('id');
        componentName = component.dataset.title;
        componentLink = componentID != null ? componentID : componentName.replace(/\s+/g, '-');
        entries.push('<li><a href="#' + componentLink + '">' + componentName + '</a></li>');
        if (componentID == null) {
          component.setAttribute('id', componentLink);
        }
      }
      entries.push('</ul>');
      tocElement.innerHTML = entries.join('\n');
      return components.appendChild(tocElement);
    }
  })();
}).call(undefined);
