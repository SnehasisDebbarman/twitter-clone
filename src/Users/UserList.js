import React, { useEffect } from "react";
import "./userlist.css";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../fb";
//recoil imports
import { useRecoilState, useRecoilValue } from "recoil";
import { userListState, usersState } from "../StateManagement/Actions";
export default function UserList() {
  //recoil state for userList
  const [userList, setUserList] = useRecoilState(usersState);

  const users = useRecoilValue(userListState);

  async function getAllPosts() {
    const userslist = [];
    const querySnapshot = await getDocs(collection(db, "users"));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      //console.log(doc.id, " => ", doc.data());
      userslist.push({ ...doc.data() });
    });
    setUserList(userslist);

    // console.log(userslist);
  }
  useEffect(() => {
    getAllPosts();
  }, []);
  return (
    <div className="user-list-container">
      <h3>Users</h3>
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
  );
}
