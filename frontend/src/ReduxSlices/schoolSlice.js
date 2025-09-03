// frontend/src/features/schools/schoolSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axios";

// NOTE: small helper to build FormData cleanly
const toFormData = (data) => {
  const fd = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === "image" && value && value.length) {
      // File input comes as FileList; we take first file
      fd.append("image", value[0]);
    } else {
      fd.append(key, value);
    }
  });
  return fd;
};

// GET all schools
export const fetchSchools = createAsyncThunk("schools/fetchAll", async () => {
  const res = await api.get("/api/schools");
  return res.data;
});

// POST add a school
export const addSchool = createAsyncThunk(
  "schools/add",
  async (payload, { rejectWithValue }) => {
    try {
      const res = await api.post("/api/schools/add", toFormData(payload), {
        headers: { "Content-Type": "multipart/form-data" },
      });
      // backend returns { message, school }
      return res.data.school;
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to add school";
      return rejectWithValue(msg);
    }
  }
);

// DELETE school
export const deleteSchool = createAsyncThunk(
  "schools/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/api/schools/${id}`);
      return id; // return id so we can filter it out in reducer
    } catch (err) {
      const msg = err?.response?.data?.message || "Failed to delete school";
      return rejectWithValue(msg);
    }
  }
);

// UPDATE school
export const updateSchool = createAsyncThunk(
  "schools/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === "image" && value && value.length) {
          formData.append("image", value[0]); // file
        } else {
          formData.append(key, value);
        }
      });

      const res = await api.put(`/api/schools/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.school;
    } catch (err) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to update school"
      );
    }
  }
);

const schoolSlice = createSlice({
  name: "schools",
  initialState: {
    items: [],
    loading: false,
    adding: false,
    error: null,
    addError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    // fetch
    builder
      .addCase(fetchSchools.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSchools.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload || [];
      })
      .addCase(fetchSchools.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });

    // add
    builder
      .addCase(addSchool.pending, (state) => {
        state.adding = true;
        state.addError = null;
      })
      .addCase(addSchool.fulfilled, (state, action) => {
        state.adding = false;
        if (action.payload) state.items.unshift(action.payload);
      })
      .addCase(addSchool.rejected, (state, action) => {
        state.adding = false;
        state.addError = action.payload || "Add failed";
      });

    // Delete school
    builder
      .addCase(deleteSchool.fulfilled, (state, action) => {
        state.items = state.items.filter((s) => s._id !== action.payload);
      })
      .addCase(deleteSchool.rejected, (state, action) => {
        state.error = action.payload;
      });

    // update school
    builder
      .addCase(updateSchool.fulfilled, (state, action) => {
        // replace the old item in state
        const idx = state.items.findIndex((s) => s._id === action.payload._id);
        if (idx !== -1) {
          state.items[idx] = action.payload;
        }
      })
      .addCase(updateSchool.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export default schoolSlice.reducer;
