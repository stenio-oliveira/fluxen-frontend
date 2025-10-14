import React from "react";
import { Box, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { debounce } from "lodash";

interface SearchProps {
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Search: React.FC<SearchProps> = ({ onChange }) => {

  const [localSearch, setLocalSearch] = React.useState<string>("");

  const handleLocalChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setLocalSearch(event.target.value);
    debouncedOnChange(event);
  };

  const debouncedOnChange = React.useMemo(() => debounce(onChange, 500), []);
  
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        px: 2,
        py: 1,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
        width: "fit-content",
      }}
    >
      <SearchIcon sx={{ mr: 1, color: "action.active" }} />
      <TextField
        placeholder="Pesquisar"
        variant="standard"
        value={localSearch}
        fullWidth
        onChange={handleLocalChange}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: "14px",
            fontWeight: "bold",
            color: "text.primary",
          },
        }}
      />
    </Box>
  );
};

export default Search;
