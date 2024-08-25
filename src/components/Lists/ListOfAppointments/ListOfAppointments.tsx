import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { AppointmentStatus, AppointmentStatusLabels } from 'src/gql/types';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { Spinner } from 'src/components/SmallComponents/Spinner';
import { parseUnixTimestamp } from 'src/utils/utils';
import { FormGroup, Input, Label, Row, Col } from 'reactstrap';

export const ListOfAppointments = observer(() => {
  const { appointmentStore } = useStores();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [users, setUsers] = useState<string[]>([]);
  const [services, setServices] = useState<(string | undefined)[]>([]);

  useEffect(() => {
    appointmentStore.fetchAppointments();

    return () => {
      appointmentStore.stopPolling();
    };
  }, [appointmentStore]);

  useEffect(() => {
    const uniqueUsers = Array.from(
      new Set(
        appointmentStore.appointments.map(
          (appointment) => appointment.user?.email
        )
      )
    );
    setUsers(uniqueUsers);

    const uniqueServices = Array.from(
      new Set(
        appointmentStore.appointments.map(
          (appointment) => appointment.service?.name
        )
      )
    );
    uniqueServices.length && setServices(uniqueServices);
  }, [appointmentStore.appointments]);

  const filteredAppointments = appointmentStore.appointments.filter(
    (appointment) => {
      const matchesSearchTerm =
        appointment.user?.email
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.user?.userName
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.service?.name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.service?.category
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase());

      const matchesUser = selectedUser
        ? appointment.user?.email === selectedUser
        : true;
      const matchesService = selectedService
        ? appointment.service?.name === selectedService
        : true;

      return matchesSearchTerm && matchesUser && matchesService;
    }
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleModify = (appointmentId: string) => {
    const newStatus = appointmentStore.appointments.find(
      (app) => app._id === appointmentId
    )?.status;
    appointmentStore.modifyAppointment(appointmentId, {
      newDate: new Date().toISOString(),
      newStatus,
    });
  };

  if (appointmentStore.isLoading) return <Spinner />;
  if (appointmentStore.error)
    return <ErrorAlert errorMessage={appointmentStore.error.message} />;
  if (filteredAppointments.length === 0) {
    return <ErrorAlert errorMessage="No appointments found" />;
  }

  return (
    <section className="table-responsive my-4 py-4">
      <Row className="mb-4 g-3 align-items-center">
        <Col md={4}>
          <FormGroup className="mb-0">
            <Label for="search" className="text-light form-label">
              Search
            </Label>
            <Input
              type="text"
              name="search"
              id="search"
              placeholder="Search by user, email, service name or category"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-0">
            <Label for="userSelect" className="text-light form-label w-100">
              Filter by User
            </Label>
            <Input
              type="select"
              name="userSelect"
              id="userSelect"
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              className="form-select"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user} value={user}>
                  {user}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
        <Col md={4}>
          <FormGroup className="mb-0">
            <Label for="serviceSelect" className="text-light form-label w-100">
              Filter by Service
            </Label>
            <Input
              type="select"
              name="serviceSelect"
              id="serviceSelect"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              className="form-select"
            >
              <option value="">All Services</option>
              {services?.map((service) => (
                <option key={service} value={service}>
                  {service}
                </option>
              ))}
            </Input>
          </FormGroup>
        </Col>
      </Row>

      <table className="table text-light">
        <thead>
          <tr>
            <th scope="col">User Email</th>
            <th scope="col">Service Name</th>
            <th scope="col">Category</th>
            <th scope="col">Last Update</th>
            <th scope="col">Status</th>
            <th scope="col">Modify</th>
            <th scope="col">Cancel</th>
          </tr>
        </thead>
        <tbody>
          {filteredAppointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.user?.email}</td>
              <td>{appointment.service?.name}</td>
              <td>{appointment.service?.category}</td>
              <td>{parseUnixTimestamp(appointment.date)}</td>
              <td>
                {
                  AppointmentStatusLabels[
                    appointment.status as AppointmentStatus
                  ]
                }
              </td>
              <td>
                <select
                  style={{ cursor: 'pointer' }}
                  value={appointment.status}
                  onChange={(e) =>
                    appointmentStore.modifyAppointment(appointment._id, {
                      newDate: appointment.date,
                      newStatus: e.target.value as AppointmentStatus,
                    })
                  }
                  onBlur={() => handleModify(appointment._id)}
                  className="form-select"
                >
                  {Object.values(AppointmentStatus).map((status) => (
                    <option key={status} value={status}>
                      {AppointmentStatusLabels[status]}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button
                  className="btn btn-danger"
                  style={{ cursor: 'pointer' }}
                  onClick={() =>
                    appointmentStore.cancelAppointment(appointment._id)
                  }
                >
                  Cancel
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
});

export default ListOfAppointments;
