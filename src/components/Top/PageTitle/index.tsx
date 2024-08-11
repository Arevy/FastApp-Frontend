import PropTypes from "prop-types";
import React from "react";
import ModalForm from "src/components/Modal/Modal";
import CreateServiceForm from "src/components/Create/CreateServiceForm";
import CreateAppointmentForm from "src/components/Create/CreateAppointmentForm";
import CreateUserForm from "src/components/Create/CreateUserForm";

interface PageTitleProps {
  text: string;
  createBtn?: boolean;
  createType?: "service" | "appointment" | "user";
}

export const PageTitle: React.FC<PageTitleProps> = ({
  text,
  createBtn,
  createType,
}) => {
  let formComponent = null;
  if (createType === "service") {
    formComponent = <CreateServiceForm />;
  } else if (createType === "appointment") {
    formComponent = <CreateAppointmentForm />;
  } else if (createType === "user") {
    formComponent = <CreateUserForm />;
  }

  return (
    <>
      <h2 className="mb-3 font-weight-light text-light">{text}</h2>
      {createBtn && (
        <ModalForm buttonLabel="Create" formComponent={formComponent} />
      )}
    </>
  );
};

PageTitle.propTypes = {
  text: PropTypes.string.isRequired,
  createBtn: PropTypes.bool,
  createType: PropTypes.oneOf(["service", "appointment", "user"]),
};
