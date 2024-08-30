import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { LoginRoute } from 'src/pages/Login/Route';
import { Link } from 'react-router-dom';

interface CreateAppointmentFormProps {
  propsServiceId?: string;
  onClose?: () => void;
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = observer(
  ({ onClose, propsServiceId }) => {
    const { appointmentStore, serviceStore, authStore, userStore } =
      useStores();
    const [serviceId, setServiceId] = useState(propsServiceId || '');
    const [date, setDate] = useState('');
    const [status, setStatus] = useState('pending');
    const [currentUserId, setUserId] = useState(authStore.userData?._id || ''); 
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!propsServiceId) {
        serviceStore.fetchServices();
      }
    }, [propsServiceId, serviceStore]);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        await appointmentStore.createAppointment(
          currentUserId,
          serviceId,
          date,
          status
        );
        await appointmentStore.fetchAppointments();
        if (onClose) {
          onClose();
        }
      } catch (err) {
        setError('Failed to create appointment. Please try again.');
      }
    };

    if (!authStore.isAuth) {
      if (!authStore.isAuth) {
        return (
          <div>
            <Alert color="warning">
              You need to be logged in to set an appointment.
            </Alert>
            <Button color="primary" tag={Link} to={LoginRoute.path}>
              Login
            </Button>
          </div>
        );
      }
    }

    return (
      <Form onSubmit={handleSubmit}>
        {error && <Alert color="danger">{error}</Alert>}
        {propsServiceId ? (
          <FormGroup>
            <Label for="serviceId">Service</Label>
            <Input
              type="select"
              name="serviceId"
              id="serviceId"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
              disabled={!!propsServiceId} // Disable selection if propsServiceId is provided
            >
              <option value={serviceId} disabled>
                {serviceStore.services.find((s) => s?._id === serviceId)
                  ?.name || 'Service not found'}
              </option>
            </Input>
          </FormGroup>
        ) : (
          <FormGroup>
            <Label for="serviceId">Service</Label>
            <Input
              type="select"
              name="serviceId"
              id="serviceId"
              value={serviceId}
              onChange={(e) => setServiceId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a service
              </option>
              {serviceStore.services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.name}
                </option>
              ))}
            </Input>
          </FormGroup>
        )}
        <FormGroup>
          <Label for="date">Date</Label>
          <Input
            type="date"
            name="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </FormGroup>
        {!propsServiceId && (
          <FormGroup>
            <Label for="status">Status</Label>
            <Input
              type="select"
              name="status"
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="canceled">Canceled</option>
            </Input>
          </FormGroup>
        )}
        {!propsServiceId && (
          <FormGroup>
            <Label for="userId">User</Label>
            <Input
              type="select"
              name="userId"
              id="userId"
              value={currentUserId}
              onChange={(e) => setUserId(e.target.value)}
              required
            >
              <option value="" disabled>
                Select a user
              </option>
              {userStore.users.map((user) => (
                <option key={user._id} value={user._id}>
                  {user.email}
                </option>
              ))}
            </Input>
          </FormGroup>
        )}
        <Button color="primary" type="submit">
          Set Appointment
        </Button>
      </Form>
    );
  }
);

export default CreateAppointmentForm;
