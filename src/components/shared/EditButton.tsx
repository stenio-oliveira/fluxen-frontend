import { IconButton } from "@mui/material";
import React from "react";
import EditIcon from "@mui/icons-material/Edit";

const EditButton = ({
  children,
  color = "primary",
  onClick,
  disabled = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof IconButton>) => {
  return (
    <IconButton
      color="primary"
      size="small"
      sx={{ "&:hover": { scale: 1.1, transition: "all 0.2s ease-in-out" } }}
      onClick={onClick}
      {...props}
    >
      <EditIcon fontSize="small" />
    </IconButton>
  );
};

export default EditButton;
