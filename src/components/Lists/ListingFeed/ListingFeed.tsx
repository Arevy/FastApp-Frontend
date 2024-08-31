import { observer } from 'mobx-react';
import React, { useEffect, useState } from 'react';
import { Spinner, Input, FormGroup, Label } from 'reactstrap';
import CreateAppointmentForm from 'src/components/Create/CreateAppointmentForm';
import ModalForm from 'src/components/Modal/Modal';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { useStores } from 'src/stores/RootStoreContext';

const ListingFeed: React.FC = observer(() => {
  const { serviceStore, authStore } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      if (category) {
        await serviceStore.fetchServicesByCategory(category);
      } else {
        await serviceStore.fetchServices().then(() => {
          const uniqueCategories = Array.from(
            new Set(serviceStore.services.map((service) => service.category))
          );
          setCategories(uniqueCategories);
        });
      }
    };
    fetchServices();
  }, [category, serviceStore, serviceStore.services.length]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredServices = serviceStore.searchServices(searchTerm).filter((service) => service.isActive);

  if (serviceStore.isLoading) return <Spinner />;
  if (serviceStore.error)
    return <ErrorAlert errorMessage={serviceStore.error?.message} />;

  return (
    <section className="services-list my-5 py-5">
      <div className="row mb-4">
        <div className="col-md-6">
          <FormGroup>
            <Label for="search" style={{ color: 'white' }}>
              Search Services
            </Label>
            <Input
              type="text"
              name="search"
              id="search"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </FormGroup>
        </div>
        <div className="col-md-6">
          <FormGroup>
            <Label for="category" style={{ color: 'white' }}>
              Filter by Category
            </Label>
            <Input
              type="select"
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All Categories</option>
              {categories.length > 0 ? (
                categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))
              ) : (
                <option disabled>No categories available</option>
              )}
            </Input>
          </FormGroup>
        </div>
      </div>
      <div className="row">
        {filteredServices.map((service) => (
          <div key={service._id} className="service-card col-md-4 mb-4">
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
              {authStore.userData.userType != 'SERVICE_USER' && (
                <div className="card-footer text-center">
                  <ModalForm
                    buttonLabel="Set an Appointment"
                    formComponent={
                      <CreateAppointmentForm propsServiceId={service._id} />
                    }
                  />
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

ListingFeed.displayName = 'ListingFeed';

export default ListingFeed;
