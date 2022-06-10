import axios from "axios";
import { AppDispatch } from "../store";
import { IUser, login } from "../slices/userSlice";
import { dbURL } from "../../assets/config";

export interface ILoginData {
    username: string;
    password: string;
}

export const fetchLogin = (userData: ILoginData) => async (dispatch: AppDispatch) => {

    fetch(`${dbURL}/api/login`, {
        method: "post",
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                alert(`Вы вошли в профиль ${data.user.username}`)
                dispatch(login(data))

            } else {
                alert(data.message)
            }

        })

}

export const fetchRegistration = async (userData: ILoginData) => {
    fetch(`${dbURL}/api/registration`, {
        method: "post",
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
        }
    })
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                alert(`Пользователь ${data.user.username} создан`)
            } else {
                alert(data.message)
            }
        });

}
