// src/components/Lists/ListOfServices/ListOfServices.tsx
import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "src/stores/RootStoreContext";
import { ErrorAlert } from "src/components/SmallComponents/ErrorAlert";
import { Spinner } from "src/components/SmallComponents/Spinner";

export const ListOfServices = observer(() => {
  const { serviceStore } = useStores();

  useEffect(() => {
    serviceStore.fetchServices();
  }, [serviceStore]);

  const handleDelete = (serviceId: string) => {
    serviceStore.deleteService(serviceId);
  };
  
  if (serviceStore.isLoading) return <Spinner />;
  if (serviceStore.error)
    return <ErrorAlert errorMessage={serviceStore.error?.message} />;

  return (
    <section className="table-responsive">
      <table className="table text-light">
        <thead>
          <tr>
            <th scope="col">Service Name</th>
            <th scope="col">Category</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceStore.services.map((service) => (
            <tr key={service.serviceId}>
              <td>{service.name}</td>
              <td>{service.category}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDelete(service.serviceId)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
});

export default ListOfServices;
