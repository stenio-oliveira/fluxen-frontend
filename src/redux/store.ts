import { configureStore } from '@reduxjs/toolkit';
import feedbackReducer from './slices/feedBackSlice';
import sideMenuReducer from './slices/sideMenuSlice';
import userReducer from './slices/userSlice';
import equipamentosTableReducer from './slices/equipamentosTableSlice';
import metricasTableReducer from './slices/metricasTableSlice';
import metricasStatsReducer from './slices/metricasStatsSlice';
import clientesTableReducer from './slices/clientesTableSlice';
import usersTableReducer from './slices/usersTableSlice';
import systemAnnouncementsTableReducer from './slices/systemAnnouncementsTableSlice';

export const store = configureStore({
  reducer: {
    feedback: feedbackReducer,
    sideMenu: sideMenuReducer,
    user: userReducer,
    equipamentosTable: equipamentosTableReducer,
    metricasTable: metricasTableReducer,
    metricasStats: metricasStatsReducer,
    clientesTable: clientesTableReducer,
    usersTable: usersTableReducer,
    systemAnnouncementsTable: systemAnnouncementsTableReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
