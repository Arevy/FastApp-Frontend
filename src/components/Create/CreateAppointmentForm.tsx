import React, { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "src/stores/RootStoreContext";
import { Button, Form, FormGroup, Label, Input, Alert } from "reactstrap";

interface CreateAppointmentFormProps {
  onClose?: () => void;
}

const CreateAppointmentForm: React.FC<CreateAppointmentFormProps> = observer(
  ({ onClose }) => {
    const { appointmentStore, serviceStore, userStore, authStore } =
      useStores();
    const [serviceId, setServiceId] = useState("");
    const [date, setDate] = useState("");
    const [status, setStatus] = useState("pending");
    const [userId, setUserId] = useState(authStore.userData?._id || ""); // need to check uuid
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      serviceStore.fetchServices();
      userStore.fetchUsers();
    }, [serviceStore, userStore]);

    const handleSubmit = async (e: { preventDefault: () => void }) => {
      e.preventDefault();
      try {
        await appointmentStore.createAppointment(
          userId,
          serviceId,
          date,
          status
        );
        await appointmentStore.fetchAppointments();
        if (onClose) {
          onClose();
        }
      } catch (err) {
        setError("Failed to create appointment. Please try again.");
      }
    };

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
          >
            <option value="" disabled>
              Select a service
            </option>
            {serviceStore.services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
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
        <FormGroup>
          <Label for="userId">User</Label>
          <Input
            type="select"
            name="userId"
            id="userId"
            value={userId}
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
        <Button color="primary" type="submit">
          Create
        </Button>
      </Form>
    );
  }
);

export default CreateAppointmentForm;
