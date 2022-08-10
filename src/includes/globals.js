import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";

export default {
  install(app) {
    const globalComponents = import.meta.glob("../components/globals/*.vue", {
      eager: true,
    });

    Object.entries(globalComponents).forEach(([filePath, component]) => {
      const componentName = upperFirst(
        camelCase(
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
