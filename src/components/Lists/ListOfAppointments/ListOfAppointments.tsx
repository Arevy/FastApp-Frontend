import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { AppointmentStatus, AppointmentStatusLabels } from 'src/gql/types';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { Spinner } from 'src/components/SmallComponents/Spinner';
import { parseUnixTimestamp } from 'src/utils/utils';
import { FormGroup, Input, Label, Row, Col, Button } from 'reactstrap';

export const ListOfAppointments = observer(() => {
  const { appointmentStore, authStore } = useStores();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedService, setSelectedService] = useState('');
  const [editing, setEditing] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<AppointmentStatus | ''>(
    ''
  );
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
        appointmentStore.appointments?.map(
          (appointment) => appointment.user?.email || ''
        )
      )
    ).filter((email) => email !== '');
    setUsers(uniqueUsers);

    const uniqueServices = Array.from(
      new Set(
        appointmentStore.appointments?.map(
          (appointment) => appointment.service?.name || ''
        )
      )
    ).filter((name) => name !== '');
    setServices(uniqueServices);
  }, [appointmentStore.appointments]);

  const filteredAppointments = appointmentStore.appointments
    ?.filter((appointment) => {
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
    })
    ?.sort((a, b) => {
      if (authStore.userData.userType === 'NORMAL_USER') {
        return a.user?.email === authStore.userData.email ? -1 : 1;
      }
      return 0;
    });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleModify = (appointmentId: string) => {
    if (selectedStatus) {
      appointmentStore.modifyAppointment(appointmentId, {
        newDate: new Date().toISOString(),
        newStatus: selectedStatus,
      });
      setEditing(null);
    }
  };

  if (appointmentStore.isLoading) return <Spinner />;
  if (appointmentStore.error)
    return <ErrorAlert errorMessage={appointmentStore.error.message} />;
  if (filteredAppointments?.length === 0) {
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
        {authStore.userData.userType !== 'NORMAL_USER' && (
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
        )}
        {authStore.userData.userType === 'NORMAL_USER' && (
          <Col md={4}>
            <FormGroup className="mb-0">
              <Label
                for="serviceSelect"
                className="text-light form-label w-100"
              >
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
        )}
      </Row>

      <table className="table text-light">
        <thead>
          <tr>
            <th scope="col">User Email</th>
            <th scope="col">Service Name</th>
            <th scope="col">Category</th>
            <th scope="col">Last Update</th>
            <th scope="col">Status</th>
            {authStore.userData.userType !== 'NORMAL_USER' && (
              <th scope="col">Actions</th>
            )}
          </tr>
        </thead>
        <tbody>
          {filteredAppointments?.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.user?.email || 'N/A'}</td>
              <td>{appointment.service?.name || 'N/A'}</td>
              <td>{appointment.service?.category || 'N/A'}</td>
              <td>{parseUnixTimestamp(appointment.date)}</td>
              <td>
                {authStore.userData.userType === 'NORMAL_USER' ? (
                  <span>
                    {
                      AppointmentStatusLabels[
                        appointment.status as AppointmentStatus
                      ]
                    }
                  </span>
                ) : editing === appointment._id ? (
                  <select
                    value={selectedStatus}
                    onChange={(e) =>
                      setSelectedStatus(e.target.value as AppointmentStatus)
                    }
                    className="form-select"
                  >
                    {Object.values(AppointmentStatus).map((status) => (
                      <option key={status} value={status}>
                        {AppointmentStatusLabels[status]}
                      </option>
                    ))}
                  </select>
                ) : (
                  <span
                    onClick={() => {
                      setEditing(appointment._id);
                      setSelectedStatus(
                        appointment.status as AppointmentStatus
                      );
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    {
                      AppointmentStatusLabels[
                        appointment.status as AppointmentStatus
                      ]
                    }
                  </span>
                )}
              </td>
              <td>
                {editing === appointment._id ? (
                  <Button
                    color="success"
                    onClick={() => handleModify(appointment._id)}
                  >
                    Save
                  </Button>
                ) : (
                  <button
                    className="btn btn-danger"
                    style={{ cursor: 'pointer' }}
                    onClick={() =>
                      appointmentStore.cancelAppointment(appointment._id)
                    }
                  >
                    Cancel
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
});

export default ListOfAppointments;
