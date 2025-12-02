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
    const fetchProfile = async () => {
      try {
        const user = await client.profile();
        dispatch(setCurrentUser(user));
        console.log("User loaded from session:", user.username);
      } catch (error) {
        console.log("No user logged in");
        dispatch(setCurrentUser(null));
      }
    };

    // Only fetch if we don't have a user yet
    if (!currentUser) {
      fetchProfile();
    }
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