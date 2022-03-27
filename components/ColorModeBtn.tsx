import React from "react";
import { IconButton, useColorMode, useColorModeValue } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";

interface ColorModeBtnProps {}

export const ColorModeBtn: React.FC<ColorModeBtnProps> = ({}) => {
  const { toggleColorMode } = useColorMode();
  const SwitchIcon = useColorModeValue(<MoonIcon />, <SunIcon />);
  const switchToColorMode = useColorModeValue("dark", "light");

  return (
    <IconButton
      aria-label={`Switch to ${switchToColorMode} mode`}
      icon={SwitchIcon}
      variant="ghost"
      onClick={toggleColorMode}
    />
  );
};
