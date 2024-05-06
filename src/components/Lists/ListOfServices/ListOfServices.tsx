import React, { useEffect } from "react";
import { observer } from "mobx-react-lite";
import { useStores } from "src/stores/RootStoreContext";
import { ErrorAlert } from "src/components/SmallComponents/ErrorAlert";
import { Spinner } from "src/components/SmallComponents/Spinner";
import { EmojiGreenCheck } from "src/components/SmallComponents/EmojiGreenCheck";
import { EmojiRedCross } from "src/components/SmallComponents/EmojiRedCross";

export const ListOfServices = observer(() => {
  const { serviceStore } = useStores();

  useEffect(() => {
    serviceStore.fetchServices();
  }, [serviceStore]);

  const handleDelete = (serviceId: string) => {
    serviceStore.deleteService(serviceId);
  };

  const handleToggleActive = async (serviceId: string) => {
    try {
      const data = await serviceStore.toggleServiceActive(serviceId);
      if (data) {
        console.log("Service active status toggled successfully");
      }
    } catch (error) {
      console.error("Failed to toggle service active status", error);
    }
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
            <th scope="col">Is Active?</th>
            <th scope="col">Actions</th>
          </tr>
        </thead>
        <tbody>
          {serviceStore.services
            .slice()
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((service) => (
              <tr key={service.serviceId}>
                <td>{service.name}</td>
                <td>{service.category}</td>
                <td
                  style={{ cursor: "pointer" }}
                  onClick={() => handleToggleActive(service.serviceId)}
                >
                  {service.isActive ? <EmojiGreenCheck /> : <EmojiRedCross />}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(service.serviceId)}
                    style={{ cursor: "pointer" }}
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
