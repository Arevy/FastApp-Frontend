import { useState, Fragment } from 'react';
// import PropTypes from 'prop-types';

import { validateRegisterForm } from 'src/utils/validations';

import React from 'react';
import { useStores } from 'src/stores/RootStoreContext';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { SubmitButton } from 'src/components/SmallComponents/SubmitButton';
import { SubmitButtonHelper } from 'src/components/SmallComponents/SubmitButtonHelper';
import { useInputValue } from 'src/hooks/useInputValue';

const propTypes = {};

export const RegisterForm: React.FC = () => {
  const { authStore } = useStores();

  const [isDisabled] = useState(false);

  const email = useInputValue('');
  const userName = useInputValue('');
  const password = useInputValue('');
  const repeatPassword = useInputValue('');

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    if (
      validateRegisterForm(
        email.value,
        userName.value,
        password.value,
        repeatPassword.value
      )
    ) {
      try {
        await authStore.registerUser(
          email.value,
          password.value,
          'NORMAL_USER',
          userName.value
        );
      } catch (error) {
        console.error(error);
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
              <label htmlFor="inputUserNameRegisterForm" className="text-light">
                Username <span className="text-danger">*</span>
              </label>
              <input
                disabled={isDisabled}
                inputMode="text"
                className="form-control"
                id="inputUserNameRegisterForm"
                placeholder="username"
                {...userName}
                required
                autoFocus
              />
              <small id="emailHelp" className="form-text text-muted">
                Make sure it's a valid Username
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
                    userName.value,
                    password.value,
                    repeatPassword.value
                  )
                }
              >
                {!authStore.isLoading ? (
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
                    userName.value,
                    password.value,
                    repeatPassword.value
                  )
                }
              />
            </div>
          </form>
        </fieldset>

        <div className="col-md-8">
          {authStore.error && (
            <ErrorAlert errorMessage={authStore.error.message} />
          )}
        </div>
      </div>
    </Fragment>
  );
};

// Apply prop types to the component
RegisterForm.propTypes = propTypes;
