import { AppDispatch } from "../store";
import { IFriendOrRequest, setToUserFriendRequests, setFriends, setUserFriendRequests } from "../slices/userSlice";
import { dbURL } from "../../assets/config";

// interface friendsAndRequestsData {
//   friends: IFriendOrRequest[],
//   userRequests: IFriendOrRequest[],
//   toUserRequests: IFriendOrRequest[]
// }

export const fetchFriendsAndRequests = (user_id: any) => async (dispatch: AppDispatch) => {
    
  fetch(`${dbURL}/api/getMyFriendsAndRequests?user_id=${user_id}`)
    .then(res => res.json())
    .then(data => {
      dispatch(setFriends(data.friends))
      dispatch(setUserFriendRequests(data.userRequests))
      dispatch(setToUserFriendRequests(data.toUserRequests))

    })


}

export const fetchFriendRequest = async (body: any) => {


  fetch(`${dbURL}/api/friendRequest`, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(res => res.json())
    .then(data => {
      alert(data)
    })


}

export const fetchAcceptOrDeclineFriendRequest = (body: any) => async (dispatch: AppDispatch) =>{

  await fetch(`${dbURL}/api/acceptOrDeclineFriendRequest`, {
    method: "PATCH",
    body: JSON.stringify(body),
    headers: {
      'Content-Type': 'application/json',
    }
  })
    .then(res => res.json())
    .then(data => {
      alert(data)
    })

    dispatch(fetchFriendsAndRequests(localStorage.getItem("user_id")))


}