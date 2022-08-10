import _ from "lodash";

export default {
  install(app) {
    const globalComponents = import.meta.glob("../components/globals/*.vue", {
      eager: true,
    });

    Object.entries(globalComponents).forEach(([filePath, component]) => {
      const componentName = _.upperFirst(
        _.camelCase(
          filePath
            .split("/")
            .pop()
            .replace(/\.\w+$/, "")
        )
      );

      app.component(`Global${componentName}`, component.default);
    });
  },
};
