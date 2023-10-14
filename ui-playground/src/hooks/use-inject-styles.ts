import { useCallback, useLayoutEffect } from "react";
import { useFrame } from "react-frame-component";
import rootStyles from "../index.css?inline";

export const useInjectStyles = () => {
  const { document: doc } = useFrame();

  const createStyle = useCallback(
    (styles: string, id: string) => {
      if (!doc) {
        return;
      }

      if (!doc?.getElementById(id)) {
        const stylesheet = doc.createElement("style");
        stylesheet.id = id;
        stylesheet.textContent = styles;

        doc.head.appendChild(stylesheet);
      }
    },
    [doc]
  );

  useLayoutEffect(() => {
    if (doc) {
      createStyle(rootStyles, "root_stylesheet");
    }
  }, [createStyle, doc]);
};
