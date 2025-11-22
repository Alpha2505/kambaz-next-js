"use client";
import { ReactNode } from "react";
import KambazNavigation from "./Navigation";
import Session from "./Account/Session";
import "./style.css";
import store from "./store";
import { Provider } from "react-redux";
export default function KambazLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <Provider store={store}>
      <Session>
        <div id="wd-kambaz">
          <div className="d-flex" id="wd-kambaz">
            <div>
              <KambazNavigation />
            </div>
            <div className="flex-fill ps-3 wd-main-content-offset">{children}</div>
          </div>
        </div>
      </Session>
    </Provider>
  );
}
