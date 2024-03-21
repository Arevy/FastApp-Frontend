import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "src/stores/RootStoreContext";
import { Spinner } from "./Spinner";
import { ErrorAlert } from "./ErrorAlert";
import { PageTitle } from "src/components/PageTitle";
import { Appointment } from "src/gql/types";

export const ListOfAppointments = observer(() => {
  const { appointmentStore } = useStores();

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
      <PageTitle text="Panel de administrare programări" />

      {appointmentStore.appointments.length > 0 ? (
        <section className="table-responsive">
          <table className="table text-light">
            <thead>
              <tr>
                <th scope="col">User Email</th>
                <th scope="col">Service Name</th>
                <th scope="col">Date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {appointmentStore.appointments.map((appointment) => (
                <tr key={appointment.uuid}>
                  <td>{appointment.user?.email}</td>
                  <td>{appointment.service?.name}</td>
                  <td>{new Date(appointment.date).toLocaleString()}</td>
                  <td>{appointment.status}</td>
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
