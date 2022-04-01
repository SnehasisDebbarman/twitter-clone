import { atom, selector, useRecoilState, useRecoilValue } from "recoil";
import React from "react";

export function Actions() {
  return <div>Actions</div>;
}
export const usersState = atom({
  key: "usersState", // unique ID (with respect to other atoms/selectors)
  default: [], // default value (aka initial value)
});

export const userListState = selector({
  key: "charCountState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const userList = get(usersState);

    return userList;
  },
});
export const savedUser = atom({
  key: "userState", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});
export const userState = selector({
  key: "userDataState", // unique ID (with respect to other atoms/selectors)
  get: ({ get }) => {
    const user = get(savedUser);

    return user;
  },
});
