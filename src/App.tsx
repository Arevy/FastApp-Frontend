import React, { StrictMode, Suspense, ReactElement } from 'react';
import { Routes, Route } from 'react-router-dom';

import { NavBar } from './components/NavBar';
import { Footer } from './components/Footer';
import { Spinner } from './components/Spinner';

import { routes } from './routes/routesConfig'; // Importul configurării rutelor

const App: React.FC = () => {
  return (
    <StrictMode>
      <div className="container-fluid bg-dark">
        <div className="container">
          <NavBar />
          <main className="pb-4">
            <Suspense fallback={<Spinner />}>
              <Routes>
                {routes.map(
                  ({
                    path,
                    element: Component,
                    wrapper: Wrapper,
                    auth,
                    admin,
                  }) => (
                    <Route
                      key={path}
                      path={path}
                      element={
                        <Suspense fallback={<Spinner />}>
                          {Wrapper ? (
                            <Wrapper>
                              <Component />
                            </Wrapper>
                          ) : (
                            <Component />
                          )}
                        </Suspense>
                      }
                    />
                  )
                )}
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
