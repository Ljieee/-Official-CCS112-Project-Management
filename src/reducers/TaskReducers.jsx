export const initialState = {
    tasks: [],
    loading: false,
    error: null,
  };
  
  export const taskReducer = (state, action) => {
    switch (action.type) {
      case "FETCH_TASKS":
        return { ...state, tasks: action.payload, loading: false };
      case "ADD_TASK":
        return { ...state, tasks: [...state.tasks, action.payload] };
      case "UPDATE_TASK":
        return {
          ...state,
          tasks: state.tasks.map((task) =>
            task.id === action.payload.id ? action.payload : task
          ),
        };
      case "DELETE_TASK":
        return {
          ...state,
          tasks: state.tasks.filter((task) => task.id !== action.payload),
        };
      case "LOADING":
        return { ...state, loading: true };
      case "ERROR":
        return { ...state, error: action.payload, loading: false };
      default:
        return state;
    }
  };
  