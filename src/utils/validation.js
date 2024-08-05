import {
  Form as VeeForm,
  Field as VeeField,
  defineRule,
  ErrorMessage,
  configure
} from 'vee-validate';
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
    defineRule('tos', required);
    defineRule('min', min);
    defineRule('max', max);
    defineRule('alpha_spaces', alpha_spaces);
    defineRule('email', email);
    defineRule('min_value', min_value);
    defineRule('max_value', max_value);
    defineRule('password_mismatch', confirmed);

    // Customize the error messages
    configure({
      generateMessage: ({ field, rule }) => {
        const messages = {
          required: `The field ${field} is required.`,
          min: `The field ${field} is too short.`,
          max: `The field ${field} is too long.`,
          alpha_spaces: `The field ${field} may only contain characters and spaces.`,
          email: `The field ${field} must be a valid email.`,
          min_value: `The field ${field} is too low.`,
          max_value: `The field ${field} it too high.`,
          password_mismatch: "The passwords don't match.",
          tos: 'You must accept the Terms of Service.'
        };

        return messages[rule.name] || `The field ${field} is invalid.`;
      }
    });
  }
};
