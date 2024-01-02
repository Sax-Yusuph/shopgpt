import { Spinner } from "@medusajs/icons";
import { IconProps } from "@medusajs/icons/dist/types";
import { clx } from "@medusajs/ui";

export type SpinnerLoadingProps = {
  iconProps?: IconProps;
};

export const SpinnerLoading = ({ iconProps }: SpinnerLoadingProps) => {
  return (
    <span role="status">
      <Spinner {...iconProps} className={clx("animate-spin", iconProps?.className)} />
    </span>
  );
};
