import { useEffect, useReducer } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionContext, SessionDispatchContext } from "./contexts";
import { sessionReducer } from "./reducers";
import { SessionStore } from "./store";
import Root from "./routes/root";
import Register from "./routes/register";
import Login from "./routes/login";
import Logout from "./routes/logout";
import Submission from "./routes/submission";
import Approval from "./routes/approval";
import View from "./routes/view";
import PendingApproval from "./routes/pendingApproval";
import Application from "./routes/apply";
import { API_URL } from "./constants";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
    },
    {
      path: "/register",
      element: <Register />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/logout",
      element: <Logout />,
    },
    {
      path: "/internship/submit",
      element: <Submission />,
    },
    {
      path: "/internship/approve/:id",
      element: <Approval />,
    },
    {
      path: "/internship/view/:id",
      element: <View />,
    },
    {
      path: "/internship/apply/:id",
      element: <Application />
    },
    {
      path: "/internships/pending",
      element: <PendingApproval />,
    },
  ]);

  const queryClient = new QueryClient();

  const [session, sessionDispatch] = useReducer(sessionReducer, {
    loggedIn: SessionStore.loggedIn,
    username: SessionStore.username,
    id: SessionStore.id,
    roles: SessionStore.roles,
  });

  // Refresh the session when the app loads
  useEffect(() => {
    fetch(`${API_URL}/profile/@me`, {
      credentials: "include",
    })
      .then((res) => res.json())
      .then((data) => {
        sessionDispatch({
          type: "refresh",
          payload: {
            loggedIn: true,
            username: data.username,
            id: data._id,
            roles: data.roles,
          },
        });
      })
      .catch(() => {
        sessionDispatch({
          type: "refresh",
          payload: {
            loggedIn: false,
            username: null,
            id: null,
            roles: [],
          },
        });
      });
  }, []);

  return (
    <SessionDispatchContext.Provider value={sessionDispatch}>
      <SessionContext.Provider value={session}>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </SessionContext.Provider>
    </SessionDispatchContext.Provider>
  );
}

export default App;
