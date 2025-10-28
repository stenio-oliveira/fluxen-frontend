import theme from "./theme";

 export const tableStyles = {
   height: "100%", // Adapts to parent height
   width: "100%",
   "& .MuiDataGrid-root": {
     border: "none", // Removes default border
     backgroundColor: "background.paper", // Theme-based background
   },
   "& .MuiDataGrid-cell": {
     fontSize: "11px",
     borderBottom: "none", // Removes cell borders
     padding: "4px 8px", // Reduced padding
     lineHeight: 1.2,
   },
   "& .MuiDataGrid-columnHeaders": {
     "& .MuiDataGrid-columnHeader": {
       maxHeight: "40px", // Reduced header height
       backgroundColor: "white",
       padding: "4px 8px", // Reduced padding
     },
     color: theme.palette.primary.main,
     fontSize: "11px",
     fontWeight: "bold",
     borderTopLeftRadius: 0,
     borderTopRightRadius: 0,
     minHeight: "40px !important",
   },

   "& .MuiDataGrid-row": {
     backgroundColor: "white",
     minHeight: "32px !important", // Reduced row height
     "&:nth-of-type(even)": {
       backgroundColor: "#fafafa", // linhas pares
     },
     "&:hover": {
       backgroundColor: "#f0f4f8", // hover sutil
     },
   },
   "& .MuiDataGrid-footerContainer": {
     backgroundColor: "background.paper",
     minHeight: "40px", // Reduced footer height
   },
   "& .MuiDataGrid-toolbarContainer": {
     backgroundColor: "background.paper",
     minHeight: "40px", // Reduced toolbar height
   },
 };