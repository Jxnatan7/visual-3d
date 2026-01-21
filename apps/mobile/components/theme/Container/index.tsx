import { RestyleContainer, RestyleContainerProps } from "@/components/restyle";
import { ContainerHeader, ContainerHeaderProps } from "../ContainerHeader";
import { Dimensions } from "react-native";

export type ContainerProps = RestyleContainerProps & {
  hideHeader?: boolean;
  containerHeaderProps?: ContainerHeaderProps;
  containerHeaderChildren?: React.ReactNode;
};

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Container = ({
  children,
  hideHeader,
  containerHeaderProps,
  containerHeaderChildren,
  ...props
}: ContainerProps) => {
  return (
    <RestyleContainer {...props}>
      {!hideHeader && (
        <ContainerHeader
          children={containerHeaderChildren}
          {...containerHeaderProps}
        />
      )}
      {children}
    </RestyleContainer>
  );
};
