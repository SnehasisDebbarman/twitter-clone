import React, { useEffect } from "react";
import "./userlist.css";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../fb";
import { getAuth } from "firebase/auth";
//recoil imports
import { useRecoilState, useRecoilValue } from "recoil";
import { userListState, usersState } from "../StateManagement/Actions";

export default function UserList() {
  //recoil state for userList
  const [userList, setUserList] = useRecoilState(usersState);

  const users = useRecoilValue(userListState);
  const mAuth = getAuth();

  async function getAllUsers() {
    const userslist = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      userslist.push({ ...doc.data() });
    });

    //remove current user from list
    setUserList(userslist);
  }
  useEffect(() => {
    getAllUsers();
  }, [mAuth.currentUser]);
  return (
    <div className="main-ul-container">
      <h3>Users</h3>
      <div className="user-list-container">
        <div>
          {users.map((user) => {
            return (
              <div className="user-list-item" key={user.userId}>
                <div className="user-list-img-container">
                  <img
                    className="user-list-img"
                    src={user.photoURL}
                    alt="profile"
                  />
                </div>
                <div className="user-list-name">{user.userName}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
