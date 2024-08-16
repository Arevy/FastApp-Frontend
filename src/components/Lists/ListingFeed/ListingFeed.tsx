import { observer } from 'mobx-react';
import React, { useEffect } from 'react';
import { Spinner } from 'reactstrap';
import CreateAppointmentForm from 'src/components/Create/CreateAppointmentForm';
import ModalForm from 'src/components/Modal/Modal';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { useStores } from 'src/stores/RootStoreContext';

const ListingFeed: React.FC = observer(() => {
  const { serviceStore } = useStores();

  useEffect(() => {
    serviceStore.fetchServices();
  }, [serviceStore]);

  if (serviceStore.isLoading) return <Spinner />;
  if (serviceStore.error)
    return <ErrorAlert errorMessage={serviceStore.error?.message} />;

  return (
    <section className="services-list row">
      {serviceStore.services.map((service) => (
        <div key={service.serviceId} className="service-card col-md-4 mb-4">
          <div className="card h-100">
            <img
              src={`data:${service.imageContentType};base64,${service.imageBase64}`}
              alt={service.name}
              className="card-img-top"
            />
            <div className="card-body">
              <h3 className="card-title">{service.name}</h3>
              <p className="card-text">{service.description}</p>
            </div>
            <div className="card-footer text-center">
              <ModalForm
                buttonLabel="Set an Appointment"
                formComponent={
                  <CreateAppointmentForm propsServiceId={service.serviceId} />
                }
              />
            </div>
          </div>
        </div>
      ))}
    </section>
  );
});

ListingFeed.displayName = 'ListingFeed';

export default ListingFeed;
