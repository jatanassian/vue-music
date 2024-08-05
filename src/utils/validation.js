import { Form as VeeForm, Field as VeeField, defineRule, ErrorMessage } from 'vee-validate';
import {
  required,
  min,
  max,
  alpha_spaces,
  email,
  min_value,
  max_value,
  confirmed
} from '@vee-validate/rules';

export default {
  install(app) {
    // Register components globally
    app.component('VeeForm', VeeForm);
    app.component('VeeField', VeeField);
    app.component('ErrorMessage', ErrorMessage);

    // Set VeeValidate validators as rules
    defineRule('required', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alpha_spaces);
    defineRule('email', email);
    defineRule('min_value', min_value);
    defineRule('max_value', max_value);
    defineRule('confirmed', confirmed);
  }
};
