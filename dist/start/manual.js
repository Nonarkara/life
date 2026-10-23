import {initSettings} from '../course/i18n.js';
import {symbolMarkup} from '../course/event-graphics.js';
for(const el of document.querySelectorAll('[data-symbol]'))el.insertAdjacentHTML('afterbegin',symbolMarkup(el.dataset.symbol));
initSettings();
