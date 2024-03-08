// Remove this import
import React, { Fragment } from 'react';

import { ErrorAlert } from '../../components/ErrorAlert';

const Page404 = () => {
  return (
    // You can directly return the ErrorAlert without using Fragment
    <ErrorAlert errorMessage="404" />
  );
};
export default Page404;
