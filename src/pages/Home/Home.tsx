import React from 'react';
import { Jumbotron } from 'src/components/Top/Jumbotron';

const Home = () => {
  return (
    <Jumbotron
      title="Home"
      subtitle="Welcome! This is a boilerplate frontend"
    />
  );
};

Home.displayName = 'Home';

export default Home;
