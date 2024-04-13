import React, { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "src/stores/RootStoreContext";
import { AppointmentStatus, AppointmentStatusLabels } from "src/gql/types";
import { ErrorAlert } from "src/components/SmallComponents/ErrorAlert";
import { Spinner } from "src/components/SmallComponents/Spinner";

export const ListOfAppointments = observer(() => {
  const { appointmentStore } = useStores();

  const [selectedStatuses, setSelectedStatuses] = useState<{
    [uuid: string]: AppointmentStatus;
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
    const newStatuses: { [uuid: string]: AppointmentStatus } = {};
    appointmentStore.appointments.forEach((appointment) => {
      newStatuses[appointment.uuid] = appointment.status as AppointmentStatus;
    });
    setSelectedStatuses(newStatuses);
  }, [appointmentStore.appointments]);

  if (appointmentStore.isLoading) return <Spinner />;
  if (appointmentStore.error)
    return <ErrorAlert errorMessage={appointmentStore.error.message} />;

  return appointmentStore.appointments.length > 0 ? (
    <section className="table-responsive">
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
            <tr key={appointment.uuid}>
              <td>{appointment.user?.email}</td>
              <td>{appointment.service?.name}</td>
              <td>{new Date(appointment.date).toLocaleString()}</td>
              <td>{appointment.status}</td>
              <td>
                <select
                  value={selectedStatuses[appointment.uuid]}
                  onChange={(e) =>
                    setSelectedStatuses({
                      ...selectedStatuses,
                      [appointment.uuid]: e.target.value as AppointmentStatus,
                    })
                  }
                  onBlur={() => handleModify(appointment.uuid)}
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
                  onClick={() =>
                    appointmentStore.cancelAppointment(appointment.uuid)
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
