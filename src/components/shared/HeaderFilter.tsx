import React, { useState } from "react";
import { TextField } from "@mui/material";
import { debounce } from "lodash";

interface HeaderFilterProps {
  field: string;
  type: "string" | "number" | "date";
  onFilterChange: (field: string, value: any) => void;
  label: string;
}



const HeaderFilter: React.FC<HeaderFilterProps> = ({
  field,
  type,
  onFilterChange,
  label,
}) => {
  const [gte, setGte] = useState<any>(null);
  const [lte, setLte] = useState<any>(null);
  const [stringValue, setStringValue] = useState("");

  const debounced = debounce(onFilterChange, 500);
  const update = (val: any, bound: "gte" | "lte") => {
    bound === "gte" ? setGte(val) : setLte(val);
    debounced(field, {
      gte: bound === "gte" ? val : gte,
      lte: bound === "lte" ? val : lte,
    });
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
  };

  if (type === "string") {
    return (
      <TextField
        variant="standard"
        fullWidth
        value={stringValue}
        onClick={handleClick}
        onChange={(e) => {
          setStringValue(e.target.value);
          debounced(field, e.target.value);
        }}
        autoComplete="off"
        slotProps={{
          htmlInput: {
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
          },
          input: {
            sx: { fontSize: 12 },
          },
        }}
        placeholder={label}
        size="small"
        sx={{ fontSize: 12 }}
      />
    );
  }
    

  if (type === "number"){ 
    return (
      <TextField
        type="number"
        fullWidth
        variant="standard"
        value={stringValue}
        onClick={handleClick}
        onChange={(e) => {
          setStringValue(e.target.value);
          debounced(field, e.target.value);
        }}
        autoComplete="off"
        slotProps={{
          htmlInput: {
            autoComplete: "off",
            autoCorrect: "off",
            autoCapitalize: "off",
            spellCheck: "false",
          },
          input: {
            sx: { fontSize: 12 },
          },
        }}
        placeholder={label}
        size="small"
        sx={{ fontSize: 12 }}
      />
    );
  }
    

  if (type === "date"){ 
     return (
       <>
         {["gte", "lte"].map((bound) => (
           <TextField
             variant="standard"
             fullWidth
             type="date"
             onClick={handleClick}
             autoComplete="off"
             slotProps={{
               input: {
                 sx: { fontSize: 12 },
                 autoComplete: "off",
               },
             }}
             value={(bound === "gte" ? gte : lte) ?? ""}
             onChange={(e) => update(e.target.value, bound as "gte" | "lte")}
             placeholder={label}
             size="small"
             sx={{ fontSize: 12 }}
           />
         ))}
       </>
     );
  }
   

  return null;
};

export default HeaderFilter;

