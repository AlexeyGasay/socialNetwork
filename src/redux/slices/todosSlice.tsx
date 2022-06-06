import {createSlice, PayloadAction} from "@reduxjs/toolkit";

export interface ITodos {
    id: number;
    title: string;
    // content: string;
    // user_id: number;
    // complete: boolean;
}


interface IState {
    todos: ITodos[]
}

const initialState: IState = {
    todos: []
}

export const todosSlice = createSlice({
    name: "todos",
    initialState: initialState,
    reducers: {
        setTodos(state, action: PayloadAction<ITodos>) {
            state.todos.push(action.payload);
        },

        // updateTodo(state, action) {
        //     for(let i = 0; i < state.todos.length; i++) {
        //         if(state.todos[i].id == action.payload) {
        //             state.todos[i].complete 
        //         }
        //     }
        // }

    }
})

export default todosSlice.reducer;
export const {setTodos} = todosSlice.actions;