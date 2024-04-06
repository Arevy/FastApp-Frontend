import { useState, Fragment, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import PropTypes from "prop-types";

import React from "react";
import { ErrorAlert } from "src/components/SmallComponents/ErrorAlert";
import { SubmitButton } from "src/components/SmallComponents/SubmitButton";
import { SubmitButtonHelper } from "src/components/SmallComponents/SubmitButtonHelper";
import { LOGIN } from "src/gql/mutations/auth";
import { useInputValue } from "src/hooks/useInputValue";
import { validateLoginForm } from "src/utils/validations";
const styles = require("./index.scss");

interface LoginFormProps {
  activateAuth: (token: string) => void;
}
class CustomError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "CustomError";
  }
}

const LoginForm: React.FC<LoginFormProps> = ({ activateAuth }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [authUser] = useMutation(LOGIN);

  const email = useInputValue("");
  const password = useInputValue("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await authUser({
        variables: { email: email.value, password: password.value },
      });
      const { token } = data.authUser;
      activateAuth(token);
    } catch (e) {
      if (e instanceof CustomError) {
        setError(e.message);
      } else {
        setError("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Fragment>
      <div className={styles["form-container"]}>
        <form className="mb-3" onSubmit={handleSubmit}>
          <fieldset disabled={loading}>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputEmailLoginForm" className="text-light">
                  Email <span className="text-danger">*</span>
                </label>
                <input
                  disabled={loading}
                  inputMode="email"
                  className="form-control"
                  id="inputEmailLoginForm"
                  placeholder="email"
                  {...email}
                  required
                  autoFocus
                />
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputPasswordLoginForm" className="text-light">
                  Password <span className="text-danger">*</span>
                </label>
                <input
                  disabled={loading}
                  className="form-control"
                  id="inputPasswordLoginForm"
                  placeholder="password"
                  type="password"
                  {...password}
                  required
                />
              </div>
            </div>
            <div className="mt-2 ml-1">
              <SubmitButton
                disabled={
                  loading || !validateLoginForm(email.value, password.value)
                }
              >
                {!loading ? (
                  "Log in"
                ) : (
                  <Fragment>
                    <span
                      className="spinner-border spinner-border-sm mr-2"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading
                  </Fragment>
                )}
              </SubmitButton>
              <SubmitButtonHelper
                mustShowHelper={!validateLoginForm(email.value, password.value)}
              />
            </div>
          </fieldset>
        </form>
        {error && <ErrorAlert errorMessage={error} />}
      </div>
    </Fragment>
  );
};

LoginForm.propTypes = {
  activateAuth: PropTypes.func.isRequired,
};

export default LoginForm;
