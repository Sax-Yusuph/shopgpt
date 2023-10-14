import { useToggleState } from "@medusajs/ui";
import { useEffect, useState } from "react";

export const useBouncyEffect = () => {
  const [animateBounce, setAnimateBounce] = useState(false);
  const [bounceAnimation, , , bounce] = useToggleState();

  useEffect(() => {
    setAnimateBounce(true);
    setTimeout(() => setAnimateBounce(false), 126);
  }, [bounceAnimation]);

  return { animateBounce, bounce };
};
