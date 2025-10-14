import theme from "./theme";

 export const tableStyles = {
   height: "100%", // Adapts to parent height
   width: "100%",
   "& .MuiDataGrid-root": {
     border: "none", // Removes default border
     backgroundColor: "background.paper", // Theme-based background
   },
   "& .MuiDataGrid-cell": {
     fontSize: "12px",
     borderBottom: "none", // Removes cell borders
   },
   "& .MuiDataGrid-columnHeaders": {
     "& .MuiDataGrid-columnHeader": {
       maxHeight: "60px",
       backgroundColor: "white",
     },
     color: theme.palette.primary.main,
     fontSize: "12px",
     fontWeight: "bold",
     borderTopLeftRadius: 0,
     borderTopRightRadius: 0,
   },

   "& .MuiDataGrid-row": {
     backgroundColor: "white",
     "&:nth-of-type(even)": {
       backgroundColor: "#fafafa", // linhas pares
     },
     "&:hover": {
       backgroundColor: "#f0f4f8", // hover sutil
     },
   },
   "& .MuiDataGrid-footerContainer": {
     backgroundColor: "background.paper",
   },
   "& .MuiDataGrid-toolbarContainer": {
     backgroundColor: "background.paper",
   },
 };