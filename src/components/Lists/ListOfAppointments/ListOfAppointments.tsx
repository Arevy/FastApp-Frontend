import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { AppointmentStatus, AppointmentStatusLabels } from 'src/gql/types';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { Spinner } from 'src/components/SmallComponents/Spinner';
import { parseUnixTimestamp } from 'src/utils/utils';

export const ListOfAppointments = observer(() => {
  const { appointmentStore } = useStores();

  const [selectedStatuses, setSelectedStatuses] = useState<{
    [_id: string]: AppointmentStatus; // Schimbare de la [uuid: string] la [_id: string]
  }>({});

  const handleModify = (appointmentId: string) => {
    const newStatus = selectedStatuses[appointmentId];
    appointmentStore.modifyAppointment(appointmentId, {
      newDate: new Date().toISOString(),
      newStatus,
    });
  };

  useEffect(() => {
    appointmentStore.fetchAppointments();

    return () => {
      appointmentStore.stopPolling();
    };
  }, [appointmentStore]);

  useEffect(() => {
    const newStatuses: { [_id: string]: AppointmentStatus } = {};
    appointmentStore.appointments.forEach((appointment) => {
      newStatuses[appointment._id] = appointment.status as AppointmentStatus; // Schimbare de la appointment.uuid la appointment._id
    });
    setSelectedStatuses(newStatuses);
  }, [appointmentStore.appointments]);

  if (appointmentStore.isLoading) return <Spinner />;
  if (appointmentStore.error)
    return <ErrorAlert errorMessage={appointmentStore.error.message} />;
  if (appointmentStore.appointments.length === 0) {
    return <ErrorAlert errorMessage="No appointments found" />;
  }

  return appointmentStore.appointments.length > 0 ? (
    <section className="table-responsive my-4 py-4">
      <table className="table text-light">
        <thead>
          <tr>
            <th scope="col">User Email</th>
            <th scope="col">Service Name</th>
            <th scope="col">Last Update</th>
            <th scope="col">Status</th>
            <th scope="col">Modify</th>
            <th scope="col">Cancel</th>
          </tr>
        </thead>
        <tbody>
          {appointmentStore.appointments.map((appointment) => (
            <tr key={appointment._id}>
              <td>{appointment.user?.email}</td>
              <td>{appointment.service?.name}</td>
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
                  value={selectedStatuses[appointment._id]}
                  onChange={(e) =>
                    setSelectedStatuses({
                      ...selectedStatuses,
                      [appointment._id]: e.target.value as AppointmentStatus,
                    })
                  }
                  onBlur={() => handleModify(appointment._id)}
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
  ) : (
    <ErrorAlert errorMessage="No appointments found" />
  );
});

export default ListOfAppointments;
