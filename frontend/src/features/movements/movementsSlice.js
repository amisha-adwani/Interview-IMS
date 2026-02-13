import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as movementsApi from '../../api/movements.api';

export const fetchMovements = createAsyncThunk(
  'movements/fetchMovements',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await movementsApi.listMovements(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createMovement = createAsyncThunk(
  'movements/createMovement',
  async (movementData, { rejectWithValue }) => {
    try {
      const { data } = await movementsApi.createMovement(movementData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const movementsSlice = createSlice({
  name: 'movements',
  initialState: {
    items: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMovements.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMovements.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchMovements.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createMovement.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(createMovement.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError } = movementsSlice.actions;
export default movementsSlice.reducer;
