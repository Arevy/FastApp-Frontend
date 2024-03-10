import React, { StrictMode, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavBar } from 'src/components/NavBar';
import { Footer } from 'src/components/Footer';
import { Spinner } from 'src/components/Spinner';
import { routes } from 'src/routes/routesConfig';
import wrapComponentForProtection from 'src/routes/wrapComponentForProtection';

const App: React.FC = () => {
  return (
    <StrictMode>
      <div className="container-fluid bg-dark">
        <div className="container">
          <NavBar />
          <main className="pb-4">
            <Suspense fallback={<Spinner />}>
              <Routes>
                {routes.map(({ path, element, wrapper, auth, admin }) => (
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
            </Suspense>
          </main>
          <div className="row pb-5"></div>
          <Footer />
        </div>
      </div>
    </StrictMode>
  );
};

export default App;
