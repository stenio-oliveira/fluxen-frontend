import { IconButton } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

export const BaseCreateButton = ({
  children,
  color = "primary",
  onClick,
  disabled = false,
  ...props
}: React.ComponentPropsWithoutRef<typeof IconButton>) => {
  return (
    <IconButton
      color={color}
      onClick={onClick}
      disabled={disabled}
      size="small"
      sx={{
        backgroundColor: "primary.main",
        height: "30px",
        width: "30px",
        "&:hover": { backgroundColor: "primary.light", scale: 1.1, transition: "all 0.2s ease-in-out" },
      }}
      {...props}
    >
      <AddIcon sx={{ color: "white"}}/>
    </IconButton>
  )
}
