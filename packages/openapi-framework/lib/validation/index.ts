import './helpers';
import * as Handlebars from 'handlebars/runtime';

require('../../../precompiled/validation.js');

function renderTemplate(filename: string, data: unknown) {
  const template = Handlebars.templates[filename];
  if (!template) {
    throw new Error(`Template not found: ${filename}`);
  }
  return template(data);
}

Handlebars.registerHelper('render_template', renderTemplate);
