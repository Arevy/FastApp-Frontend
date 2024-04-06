import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "src/stores/RootStoreContext";
import { PageTitle } from "src/components/Top/PageTitle";
import { ModifyAppointmentInput } from "src/gql/types";
import { ErrorAlert } from "src/components/SmallComponents/ErrorAlert";
import { Spinner } from "src/components/SmallComponents/Spinner";

export const ListOfAppointments = observer(() => {
  const { appointmentStore } = useStores();

  const handleModify = (
    appointmentId: string,
    newData: Omit<ModifyAppointmentInput, "id">
  ) => {
    const modifiedData = {
      ...newData,
      newDate: newData.newDate
        ? new Date(newData.newDate).toISOString()
        : undefined,
    };
    appointmentStore.modifyAppointment(appointmentId, modifiedData);
  };

  const handleCancel = (appointmentId: string) => {
    appointmentStore.cancelAppointment(appointmentId);
  };

  useEffect(() => {
    appointmentStore.fetchAppointments();

    return () => {
      appointmentStore.stopPolling();
    };
  }, [appointmentStore]);

  if (appointmentStore.isLoading) return <Spinner />;
  if (appointmentStore.error)
    return <ErrorAlert errorMessage={appointmentStore.error.message} />;

  return (
    <React.Fragment>
      {appointmentStore.appointments.length > 0 ? (
        <section className="table-responsive">
          <table className="table text-light">
            <thead>
              <tr>
                <th scope="col">User Email</th>
                <th scope="col">Service Name</th>
                <th scope="col">Date</th>
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
                    <button
                      onClick={() =>
                        handleModify(appointment.uuid, {
                          newDate: new Date().toISOString(), // Convert current date to ISO string
                          newStatus: "", // Or whatever status you need to set
                        })
                      }
                    >
                      Modify
                    </button>
                  </td>
                  <td>
                    <button onClick={() => handleCancel(appointment.uuid)}>
                      Cancel
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <ErrorAlert errorMessage="Nicio programare găsită" />
      )}
    </React.Fragment>
  );
});

export default ListOfAppointments;
