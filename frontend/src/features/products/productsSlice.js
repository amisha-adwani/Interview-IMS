import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as productsApi from '../../api/products.api';

export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.listProducts(params);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchProduct',
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.getProduct(id);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const createProduct = createAsyncThunk(
  'products/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.createProduct(productData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const bulkCreateProducts = createAsyncThunk(
  'products/bulkCreateProducts',
  async (products, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.bulkCreateProducts(products);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateProduct = createAsyncThunk(
  'products/updateProduct',
  async ({ id, data: productData }, { rejectWithValue }) => {
    try {
      const { data } = await productsApi.updateProduct(id, productData);
      return data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await productsApi.deleteProduct(id);
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    pagination: { page: 1, limit: 20, total: 0, totalPages: 0 },
    selectedProduct: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearSelected: (state) => {
      state.selectedProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload.data;
      })
      .addCase(createProduct.fulfilled, (state) => {
        state.error = null;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.selectedProduct = action.payload.data;
        state.error = null;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p._id !== action.payload);
        state.selectedProduct = null;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearSelected, clearError } = productsSlice.actions;
export default productsSlice.reducer;
