import { IconButton } from "@mui/material"

export const BaseIconButton = ({
  children,
  onClick,
  disabled = false,
  sx = {},
  ...props
}: React.ComponentPropsWithoutRef<typeof IconButton>) => {
  return (
    <IconButton
      onClick={onClick}
      disabled={disabled}
      sx={{
        color: 'primary.main',
        boxShadow: 1, 
        '&:hover': { scale: 1.1, transition: 'all 0.2s ease-in-out' },
        ...sx,
      }}
      {...props}
    >
      {children}
    </IconButton>
  )
}
