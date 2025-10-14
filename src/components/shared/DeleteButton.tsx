import { IconButton } from '@mui/material'
import React from 'react'
import DeleteIcon from '@mui/icons-material/Delete';

const DeleteButton = ({
  children,
  color = "primary",
  onClick,
  disabled = false,
  ...props
} : React.ComponentPropsWithoutRef<typeof IconButton>) => {
  return (
    <IconButton
      color="error"
      size="small"
      sx={{ "&:hover": { scale: 1.1, transition: "all 0.2s ease-in-out" } }}
      onClick={onClick}
      {...props}
    >
      <DeleteIcon fontSize="small" />
    </IconButton>
  );
};

export default DeleteButton