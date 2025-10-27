import React from "react";
import { Button } from "@mui/material";

export const BaseCancelButton = ({
  children,
  variant = "contained",
  color = "primary",
  startIcon,
  endIcon,
  onClick,
  disabled = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof Button>) => {
  return (
    <Button
      variant={variant}
      color={color}
      startIcon={startIcon}
      endIcon={endIcon}
      onClick={onClick}
      disabled={disabled}
      sx={{
        borderRadius: "6px",
        backgroundColor: "error.main",
        "&:hover": { backgroundColor: "error.light" },
        fontSize: "12px",
        boxShadow: "none",
      }}
      {...props}
    >
      {children}
    </Button>
  );
};
