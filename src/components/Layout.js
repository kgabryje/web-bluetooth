import styled from "styled-components";
import {
  style,
  space,
  color,
  width,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  fontSize,
  flex,
  order,
  alignSelf,
  position,
  borders,
  borderColor,
  zIndex,
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent
} from "styled-system";

const display = style({
  prop: "display",
  cssProperty: "display",
  numberToPx: false
});

const height = style({
  prop: "height",
  alias: "h",
  numberToPx: true
});

export const Box = styled("div")(
  {
    boxSizing: "border-box"
  },
  space,
  color,
  width,
  minHeight,
  maxHeight,
  minWidth,
  maxWidth,
  fontSize,
  flex,
  order,
  alignSelf,
  display,
  height,
  position,
  borders,
  borderColor,
  zIndex
);

Box.displayName = "Box";

Box.propTypes = {
  ...space.propTypes,
  ...color.propTypes,
  ...width.propTypes,
  ...fontSize.propTypes
};

export const Flex = styled(Box)(
  {
    display: "flex"
  },
  flexWrap,
  flexDirection,
  alignItems,
  justifyContent,
  display,
  height,
  maxWidth,
  maxHeight,
  position,
  borders,
  borderColor,
  zIndex
);

Flex.displayName = "Flex";

Flex.propTypes = {
  ...flexWrap.propTypes,
  ...flexDirection.propTypes,
  ...alignItems.propTypes,
  ...justifyContent.propTypes
};


export const Container = styled(Flex)`
  ${position};
  max-width: 64em;
`;

Container.defaultProps = {
  flexDirection: "column",
  mx: "auto",
  px: ["8px", "64px", "none"],
};
