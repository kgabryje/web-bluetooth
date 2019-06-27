import posed from "react-pose";
import { Flex } from "./Layout";

export const Appear = posed(Flex)({
  enter: {
    opacity: 1,
    y: 0,
    delay: 500,
    delayChildren: 500,
    staggerChildren: 500,
    transition: {
      opacity: { ease: "easeOut", duration: 500 },
      y: { ease: "easeOut", duration: 500 }
    }
  },
  exit: {
    opacity: 0,
    y: 300,
    transition: {
      opacity: { ease: "easeOut", duration: 500 },
      y: { ease: "easeOut", duration: 500 }
    }
  }
});