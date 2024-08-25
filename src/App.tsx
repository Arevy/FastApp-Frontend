import React, { StrictMode, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { NavBar } from 'src/components/Top/NavBar';
import { Footer } from 'src/components/Footer';
import { Spinner } from 'src/components/SmallComponents/Spinner';
import { routesArray } from 'src/routes/routesConfig';
import wrapComponentForProtection from 'src/routes/wrapComponentForProtection';

const App: React.FC = () => {
  return (
    <StrictMode>
      <div className="container-fluid bg-dark">
        <div className="container d-flex flex-column min-vh-100">
          <NavBar />
          <main className="py-4 flex-grow-1">
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
          <Footer className="mt-auto py-3" />
        </div>
      </div>
    </StrictMode>
  );
};

export default App;
