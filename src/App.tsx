import React, { StrictMode, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import { NavBar } from "src/components/Top/NavBar";
import { Footer } from "src/components/Footer";
import { Spinner } from "src/components/SmallComponents/Spinner";
import { routesArray } from "src/routes/routesConfig";
import wrapComponentForProtection from "src/routes/wrapComponentForProtection";

const App: React.FC = () => {
  return (
    <StrictMode>
      <div className="container-fluid bg-dark">
        <div className="container">
          <NavBar />
          <main className="pb-4">
            <Routes>
              {routesArray.map(({ path, element, wrapper, auth, admin }) => (
                <Route
                  key={path}
                  path={path}
                  element={
                    <Suspense fallback={<Spinner />}>
                      {wrapComponentForProtection(element, {
                        auth,
                        admin,
                        wrapper,
                      })}
                    </Suspense>
                  }
                />
              ))}
            </Routes>
          </main>
          <div className="row pb-5"></div>
          <Footer />
        </div>
      </div>
    </StrictMode>
  );
};

export default App;
