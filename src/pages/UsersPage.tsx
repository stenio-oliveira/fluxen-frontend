import { Box } from '@mui/material'
import UsersTable from '../tables/UsersTable'

const UsersPage = () => {
  return (
    <Box sx={{ display: "flex", height: "100vh", bgcolor: "grey.50", p: 4, width: "90vw" }}>
      <UsersTable />
    </Box>
  )
}

export default UsersPage