import axios from "axios";
import { dbURL } from "../../assets/config";
import { ITodos, todosSlice } from "../slices/todosSlice";
import { AppDispatch } from "../store";

// export const fetchTodos = () => async (dispatch: AppDispatch) => {
//     const res = await axios.get<ITodos[]>("${dbURL}/api/todos");

//     dispatch(todosSlice.actions.setTodos(res.data));
// }


export interface IchangeTodo {
    complete: boolean;
    id: number;
}

export const changeTodo = (body: IchangeTodo) => async (dispatch: AppDispatch) => {
    fetch(`${dbURL}/api/todos`, {
        method: "put",
        body: JSON.stringify(body),
        headers: {
            'Content-Type': 'application/json',
        }

    })
    .then(res => res.json())
    .then(data => console.log(data))


    // dispatch(todosSlice.actions.setTodos(res.data));

}
