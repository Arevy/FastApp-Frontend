import React from 'react';
import classNames from 'classnames';

const styles = require('./Footer.scss');

interface FooterProps {
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({ className }) => {
  return (
    <footer
      className={classNames(
        'footer mt-auto py-3 fixed-bottom bg-dark border-top border-info',
        className
      )}
    >
      <div className="container text-center">
        <span className="text-muted font-weight-light">
          Made by
          <p
            className={classNames(styles['text-info'])}
            rel="noreferrer noopener"
          >
            Aurelian Mihai
          </p>
        </span>
      </div>
    </footer>
  );
};
