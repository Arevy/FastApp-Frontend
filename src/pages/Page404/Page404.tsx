// Remove this import
import React from 'react';

import { ErrorAlert } from '../../components/SmallComponents/ErrorAlert';

const Page404 = () => {
  return (
    // You can directly return the ErrorAlert without using Fragment
    <ErrorAlert errorMessage="404" />
  );
};
export default Page404;
