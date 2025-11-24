import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes/index";
import { setUser } from "./redux/features/userSlice";
import { jwtDecode } from "jwt-decode";
import DefaultLayout from "~/components/layout/DefaultLayout";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import type User from "~/model/User";
function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const localToken = localStorage.getItem("userToken");
    if (localToken) {
      const decoded = jwtDecode<User>(localToken);
      const { user_id, email, fullName } = decoded;
      dispatch(setUser({ user_id, email, fullName }));
    }
  }, []);

  return (
    <Router>
      <div>
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            const Layout = route.Layout ?? DefaultLayout; // Nếu null => dùng Fragment

            return (
              <Route
                key={index}
                path={route.path}
                element={
                  route.Layout === null ? (
                    <Page />
                  ) : (
                    <Layout>
                      <Page />
                    </Layout>
                  )
                }
              />
            );
          })}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
