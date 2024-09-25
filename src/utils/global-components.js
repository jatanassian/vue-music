import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';

// Loop through the components in the global folder, format the component's name depending of the file name,
// and register the components globally one by one
export default {
  install(app) {
    const baseComponents = import.meta.glob('../components/global/*.vue', {
      // import.meta.glob searches for files with patterns
      eager: true // Means we don't want lazy loading
    });

    Object.entries(baseComponents).forEach(([path, module]) => {
      const componentName = upperFirst(
        camelCase(
          path
            .split('/')
            .pop()
            .replace(/\.\w+$/, '')
        )
      ); // Extract the component name from the file path and PascalCase it

      // Because components use "export default", we can import them with the default property
      app.component(`Base${componentName}`, module.default);
    });
  }
};
