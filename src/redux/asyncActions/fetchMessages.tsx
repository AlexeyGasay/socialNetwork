import { AppDispatch } from "../store";

import { setContacts, setLastMessages, setMessages } from "../slices/userSlice";
import { dbURL } from "../../assets/config";


export const fetchContacts = (user_id: any) => async (dispatch: AppDispatch) => {

  fetch(`${dbURL}/api/getMyContacts?user_id=${user_id}`)
    .then(res => res.json())
    .then(data => {
      dispatch(setContacts(data))

    })

}

export const fetchMessages = (
  sender: string | null,
  recipient: string | undefined,
  page: number | string | null,
  arrLength: number,
  theEnd: boolean
) => async (dispatch: AppDispatch) => {

  fetch(`${dbURL}/api/getMessages?sender=${sender}&recipient=${recipient}&page=${page}&arrLength=${arrLength}&theEnd=${theEnd}`)
    .then(res => res.json())
    .then(data => {
      dispatch(setMessages(data))

    })

}

export const fetchLastMessages = (sender: string | null, recipient: string | undefined) => async (dispatch: AppDispatch) => {

  fetch(`${dbURL}/api/getLastMessages?sender=${sender}&recipient=${recipient}`)
    .then(res => res.json())
    .then(data => {
      dispatch(setLastMessages(data))
    })

}

export const fetchSendMessage = (body: any) => async (dispatch: AppDispatch) => {

  fetch(`${dbURL}/api/sendMessage`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);

    })


}
