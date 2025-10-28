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
        px: 1.5,
        py: 0.5,
        bgcolor: "background.paper",
        borderRadius: 1,
        boxShadow: 1,
        width: "fit-content",
        minHeight: 36,
      }}
    >
      <SearchIcon sx={{ mr: 1, color: "action.active", fontSize: 18 }} />
      <TextField
        placeholder="Pesquisar"
        variant="standard"
        value={localSearch}
        fullWidth
        onChange={handleLocalChange}
        InputProps={{
          disableUnderline: true,
          sx: {
            fontSize: "13px",
            fontWeight: 500,
            color: "text.primary",
            '& input': {
              padding: '4px 0',
            },
          },
        }}
      />
    </Box>
  );
};

export default Search;
