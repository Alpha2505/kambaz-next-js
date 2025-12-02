"use client";
import { ReactNode, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentUser } from "./Account/reducer";
import { RootState } from "../(Kambas)/store";
import * as client from "./Account/client";
import KambazNavigation from "./Navigation";
import "./style.css";
import store from "./store";
import { Provider } from "react-redux";

function SessionHandler({ children }: { children: ReactNode }) {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  useEffect(() => {
    // 1. Load from localStorage on first mount
    const saved = localStorage.getItem("currentUser");
    if (saved && !currentUser) {
      dispatch(setCurrentUser(JSON.parse(saved)));
      return;
    }

    // 2. If no saved user, fetch session from backend
    const fetchProfile = async () => {
      try {
        const user = await client.profile();
        dispatch(setCurrentUser(user));

        // Save to localStorage
        localStorage.setItem("currentUser", JSON.stringify(user));
      } catch (error) {
        console.log("No user logged in");
        dispatch(setCurrentUser(null));
        localStorage.removeItem("currentUser");
      }
    };

    if (!currentUser) fetchProfile();
  }, [currentUser, dispatch]);

  return <>{children}</>;
}

export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <SessionHandler>
        <div id="wd-kambaz">
          <div className="d-flex" id="wd-kambaz">
            <div>
              <KambazNavigation />
            </div>
            <div className="flex-fill ps-3 wd-main-content-offset">{children}</div>
          </div>
        </div>
      </SessionHandler>
    </Provider>
  );
}