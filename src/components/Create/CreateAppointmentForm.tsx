import React, { useState, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { Button, Form, FormGroup, Label, Input, Alert } from 'reactstrap';
import { LoginRoute } from 'src/pages/Login/Route';
import { Link } from 'react-router-dom';
import { autorun } from 'mobx';

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
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const fetchData = async () => {
        if (userStore.users.length === 0) {
          await userStore.fetchUsers();
        }

        if (!propsServiceId || authStore.userData.userType === 'SERVICE_USER') {
          await serviceStore.fetchServices();
          if (serviceStore.currentService) {
            setServiceId(serviceStore.currentService._id);
          }
        }
        setIsLoading(false);
      };

      fetchData();
      const disposeAutorun = autorun(() => {
        if (serviceStore.currentService) {
          setServiceId(serviceStore.currentService._id);
        }
      });
      return () => {
        disposeAutorun();
      };
    }, [propsServiceId, authStore.userData.userType, serviceStore, userStore]);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        await appointmentStore.createAppointment(
          currentUserId,
          serviceId,
          date,
          authStore.userData.userType == 'NORMAL_USER' ? 'pending' : status
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

    if (isLoading) {
      return <div>Loading data...</div>;
    }

    return (
      <Form onSubmit={handleSubmit}>
        {error && <Alert color="danger">{error}</Alert>}
        <FormGroup>
          <Label for="serviceId">Service</Label>
          <Input
            type="select"
            name="serviceId"
            id="serviceId"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            required
            disabled={
              !!propsServiceId || authStore.userData.userType === 'SERVICE_USER'
            }
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
        {(!propsServiceId || authStore.userData.userType == 'NORMAL_USER') && (
          <>
            {authStore.userData.userType != 'NORMAL_USER' && (
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
            <FormGroup>
              <Label for="userId">User</Label>
              <Input
                type="select"
                name="userId"
                id="userId"
                value={currentUserId}
                onChange={(e) => setUserId(e.target.value)}
                required
                disabled={authStore.userData.userType == 'NORMAL_USER'}
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
          </>
        )}
        <Button color="primary" type="submit">
          Set Appointment
        </Button>
      </Form>
    );
  }
);

export default CreateAppointmentForm;
