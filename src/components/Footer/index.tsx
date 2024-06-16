import React from 'react';
import classNames from 'classnames';

const styles = require('./Footer.scss');

export const Footer = () => {
  return (
    <footer
      className={classNames(
        'footer mt-auto py-3 fixed-bottom bg-dark border-top border-info'
      )}
    >
      <div className="container text-center">
        <span className="text-muted font-weight-light">
          Made by
          <p
            className={classNames(styles['text-info'])}
            rel="noreferrer noopener"
          >
            Arevy
          </p>
        </span>
      </div>
    </footer>
  );
};
