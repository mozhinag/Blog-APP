import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import postService from '../posts/postService';

const initialState = {
  posts: [],
  post: null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
};

// Thunks
export const createPost = createAsyncThunk(
  'posts/create',
  async (formData, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.createPost(formData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getAllPosts = createAsyncThunk(
  'posts/getAll',
  async (_, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.getAllPosts(token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPublicPosts = createAsyncThunk(
  'posts/getPublic',
  async (_, thunkAPI) => {
    try {
      return await postService.getPublicPosts();
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const getPostByUserId = createAsyncThunk(
  'posts/getPostByUserId',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.getPostByUserId(id, token);
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response.data);
    }
  }
);

// ✔ Async thunk — fetch post using postId
export const getPostByPostId = createAsyncThunk(
  "posts/getPostByPostId",
  async (id, thunkAPI) => {
    try {
      return await postService.getPostByPostId(id);
    } catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);


export const deletedPost = createAsyncThunk(
  'posts/delete',
  async (id, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.deletedPost(id, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const updatedPost = createAsyncThunk(
  'posts/update',
  async ({ id, formData }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.updatedPost(id, formData, token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);
export const likePost = createAsyncThunk(
  'posts/likePost',
  async (id, thunkAPI) => {
    try {
      const user = thunkAPI.getState().auth.user;

      if (!user || !user.token) {
        return thunkAPI.rejectWithValue('Authentication required');
      }

      return await postService.likePost(id, user.token);
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || error.toString();

      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const addComment = createAsyncThunk(
  "posts/addComment",
  async ({ postId, text }, thunkAPI) => {
    try {
      const token = thunkAPI.getState().auth.user.token;
      return await postService.addComment(postId, text, token);
    }
    catch (error) {
      const message =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);




const postSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    reset: (state) => {
      state.posts = [];
      state.post = null;
      state.isError = false;
      state.isSuccess = false;
      state.isLoading = false;
      state.message = '';
    },
  },
  extraReducers: (builder) => {
    builder
      // CREATE
      .addCase(createPost.pending, (state) => {
        state.isLoading = true;
      })

      .addCase(createPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts.push(action.payload);
      })

      .addCase(createPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // GET ALL (PRIVATE)
      .addCase(getAllPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.posts = action.payload.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      })

      .addCase(getAllPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // GET PUBLIC
      .addCase(getPublicPosts.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPublicPosts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;

        state.posts = action.payload.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
      })

      .addCase(getPublicPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // GET POST BY USER ID
      .addCase(getPostByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload; // <- Make sure you assign to `post`, not `posts`
      })
      .addCase(getPostByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = action.payload;
        state.post = null;
      })
      //GET POST BY POST ID
      .addCase(getPostByPostId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPostByPostId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.post = action.payload;
      })
      .addCase(getPostByPostId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // DELETE
      .addCase(deletedPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(deletedPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.filter(
          (post) => post._id !== action.payload.id
        );
        if (state.post?._id === action.payload._id) state.post = null;
      })

      .addCase(deletedPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // UPDATE
      .addCase(updatedPost.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(updatedPost.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.posts = state.posts.map((post) =>
          post._id === action.payload._id ? action.payload : post
        );
      })
      .addCase(updatedPost.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      //likes
      .addCase(likePost.fulfilled, (state, action) => {
        state.isSuccess = true;
        state.posts = state.posts.map((p) =>
          p._id === action.payload._id ? action.payload : p
        );
        state.post = action.payload;
      })
      .addCase(addComment.fulfilled, (state, action) => {
        if (state.post?._id === action.payload.postId) {
          state.post.comments.push(action.payload.comment);
        }
      });



  },
});

export const { reset } = postSlice.actions;
export default postSlice.reducer;
