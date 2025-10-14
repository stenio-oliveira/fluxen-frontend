import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type FeedbackState = {
  message: string | null;
  type: 'success' | 'error' | 'info' | 'warning' | null;
};

const initialState: FeedbackState = {
  message: null,
  type: null,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    setFeedback: (state, action: PayloadAction<{ message: string; type: 'success' | 'error' | 'info' | 'warning' }>) => {
      state.message = action.payload.message;
      state.type = action.payload.type;
    },
    clearFeedback: (state) => {
      state.message = null;
      state.type = null;
    },
  },
});

export const { setFeedback, clearFeedback } = feedbackSlice.actions;
export default feedbackSlice.reducer;
