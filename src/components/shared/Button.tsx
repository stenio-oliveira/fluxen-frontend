import React from 'react'
import { Button, useTheme } from '@mui/material'

export const BaseButton = ({
  children,
  variant = 'contained',
  color = 'primary',
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
          borderRadius: '6px',
          backgroundColor: 'primary.main',
          '&:hover': { backgroundColor: 'primary.light' },
          fontSize: '12px',
          boxShadow : 'none'
      }}
      {...props}
    >
      {children}
    </Button>
  )
}
