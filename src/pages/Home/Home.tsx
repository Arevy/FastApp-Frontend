import React from 'react';
import { Jumbotron } from 'src/components/Top/Jumbotron';
import ListingFeed from 'src/components/Lists/ListingFeed/ListingFeed';

const Home: React.FC = () => {
  return (
    <>
      <Jumbotron
        title="Welcome to FastApp!"
        subtitle="This is the best place you can search for services"
      />
      <ListingFeed />
    </>
  );
};

Home.displayName = 'Home';

export default Home;
