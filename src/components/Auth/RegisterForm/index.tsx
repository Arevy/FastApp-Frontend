import { useState, Fragment } from 'react';
// import PropTypes from 'prop-types';

import { ErrorAlert } from '../Emoji/ErrorAlert';
import { SubmitButton } from '../SubmitButton';
import { SubmitButtonHelper } from '../SubmitButtonHelper';

import { useInputValue } from '../../hooks/useInputValue';
import { validateRegisterForm } from 'src/utils/validations';

import React from 'react';
import { useStores } from 'src/stores/RootStoreContext';

const propTypes = {};

export const RegisterForm: React.FC = () => {
  const { userStore } = useStores();

  const [isDisabled, setIsDisabled] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);

  const email = useInputValue('');
  const password = useInputValue('');
  const repeatPassword = useInputValue('');

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (
      validateRegisterForm(email.value, password.value, repeatPassword.value)
    ) {
      try {
        await userStore.registerUser(
          email.value,
          password.value,
          'NORMAL_USER'
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  return (
    <Fragment>
      <div className="row justify-content-center mt-4">
        <fieldset disabled={isDisabled}>
          <form className="col-md-8" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="inputEmailRegisterForm" className="text-light">
                Email <span className="text-danger">*</span>
              </label>
              <input
                disabled={isDisabled}
                inputMode="email"
                className="form-control"
                id="inputEmailRegisterForm"
                placeholder="email"
                {...email}
                required
                autoFocus
              />
              <small id="emailHelp" className="form-text text-muted">
                Make sure it's a valid email address
              </small>
            </div>
            <div className="form-group">
              <label htmlFor="inputPasswordRegisterForm" className="text-light">
                Password <span className="text-danger">*</span>
              </label>
              <input
                disabled={isDisabled}
                className="form-control"
                id="inputPasswordRegisterForm"
                placeholder="password"
                type="password"
                {...password}
                required
                // pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!*^?+-_@#$%&]{8,}$"
              />
              <small id="passwordHelp" className="form-text text-muted">
                At least 8 characters. It must contain numbers, lowercase
                letters and uppercase letters. The spaces are not allowed
              </small>
            </div>
            <div className="form-group">
              <label
                htmlFor="inputRepeatPasswordRegisterForm"
                className="text-light"
              >
                Repeat password <span className="text-danger">*</span>
              </label>
              <input
                disabled={isDisabled}
                className="form-control"
                id="inputRepeatPasswordRegisterForm"
                placeholder="repeat password"
                type="password"
                {...repeatPassword}
                required
                // pattern="^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z!*^?+-_@#$%&]{8,}$"
              />
              <small id="repeatPasswordHelp" className="form-text text-muted">
                At least 8 characters. It must contain numbers, lowercase
                letters and uppercase letters. The spaces are not allowed
              </small>
            </div>
            <div className="mt-2 ml-1">
              <SubmitButton
                disabled={
                  isDisabled ||
                  !validateRegisterForm(
                    email.value,
                    password.value,
                    repeatPassword.value
                  )
                }
              >
                {!userStore.isLoading ? (
                  'Create account'
                ) : (
                  <Fragment>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    <span>Loading</span>
                  </Fragment>
                )}
              </SubmitButton>
              <SubmitButtonHelper
                mustShowHelper={
                  !validateRegisterForm(
                    email.value,
                    password.value,
                    repeatPassword.value
                  )
                }
              />
            </div>
          </form>
        </fieldset>

        <div className="col-md-8">
          {userStore.error && (
            <ErrorAlert errorMessage={userStore.error.message} />
          )}
        </div>
      </div>
    </Fragment>
  );
};

// Apply prop types to the component
RegisterForm.propTypes = propTypes;
