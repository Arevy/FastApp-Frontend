import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody } from 'reactstrap';

function ModalForm(props: {
  buttonLabel: any;
  className?: string;
  formComponent?: JSX.Element | null;
}) {
  const [modal, setModal] = useState(false);

  const toggle = () => {
    setModal(!modal);
  };

  const closeBtn = (
    <button className="close" onClick={toggle}>
      &times;
    </button>
  );
  const label = props.buttonLabel;

  let button;
  let title;

  if (label === 'Edit') {
    button = (
      <Button
        color="warning"
        onClick={toggle}
        style={{ float: 'left', marginRight: '10px' }}
      >
        {label}
      </Button>
    );
    title = 'Edit Item';
  } else {
    button = (
      <Button
        color="success"
        onClick={toggle}
        style={{ float: 'left', marginRight: '10px' }}
      >
        {label}
      </Button>
    );
    title = 'Add New Item';
  }

  return (
    <div>
      {button}
      <Modal
        isOpen={modal}
        toggle={toggle}
        className={props.className}
        backdrop={'static'}
        keyboard={false}
        centered
        fade
      >
        <ModalHeader toggle={toggle} close={closeBtn}>
          {title}
        </ModalHeader>
        {props.formComponent && (
          <ModalBody>
            {React.cloneElement(props.formComponent, { onClose: toggle })}
          </ModalBody>
        )}
      </Modal>
    </div>
  );
}

export default ModalForm;
