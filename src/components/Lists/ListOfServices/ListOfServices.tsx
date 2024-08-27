import React, { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStores } from 'src/stores/RootStoreContext';
import { ErrorAlert } from 'src/components/SmallComponents/ErrorAlert';
import { Spinner } from 'src/components/SmallComponents/Spinner';
import { EmojiGreenCheck } from 'src/components/SmallComponents/EmojiGreenCheck';
import { EmojiRedCross } from 'src/components/SmallComponents/EmojiRedCross';
import { FormGroup, Input, Label, Row, Col } from 'reactstrap';

export const ListOfServices = observer(() => {
  const { serviceStore } = useStores();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchServicesAndCategories = async () => {
      await serviceStore.fetchServices();
      const uniqueCategories = Array.from(
        new Set(serviceStore.services.map((service) => service.category))
      );
      setCategories(uniqueCategories);
    };

    fetchServicesAndCategories();
  }, [serviceStore]);

  useEffect(() => {
    if (category === '') {
      serviceStore.fetchServices();
    } else {
      serviceStore.fetchServicesByCategory(category);
    }
  }, [category, serviceStore]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredServices = serviceStore.searchServices(searchTerm);

  const handleDelete = (serviceId: string) => {
    serviceStore.deleteService(serviceId);
  };

  const handleToggleActive = async (serviceId: string) => {
    try {
      const data = await serviceStore.toggleServiceActive(serviceId);
      if (data) {
        console.log('Service active status toggled successfully');
      }
    } catch (error) {
      console.error('Failed to toggle service active status', error);
    }
  };

  if (serviceStore.isLoading) return <Spinner />;
  if (serviceStore.error)
    return <ErrorAlert errorMessage={serviceStore.error?.message} />;

  return (
    <section className="table-responsive my-4 py-4">
      <Row className="mb-4 align-items-center">
        <Col md={6} className="d-flex align-items-center">
          <FormGroup className="w-100 mb-0">
            <Label for="search" className="text-light form-label">
              Search Services
            </Label>
            <Input
              type="text"
              name="search"
              id="search"
              placeholder="Search by name or description"
              value={searchTerm}
              onChange={handleSearchChange}
              className="form-control"
            />
          </FormGroup>
        </Col>
        <Col md={6} className="d-flex align-items-center">
          <FormGroup className="w-100 mb-0">
            <Label for="category" className="text-light form-label w-100">
              Filter by Category
            </Label>
            <Input
              type="select"
              name="category"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="form-select"
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
        </Col>
      </Row>
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
          {filteredServices
            .slice()
            .sort((a, b) => a.category.localeCompare(b.category))
            .map((service) => (
              <tr key={service._id}>
                <td>{service.name}</td>
                <td>{service.category}</td>
                <td
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleToggleActive(service._id)}
                >
                  {service.isActive ? <EmojiGreenCheck /> : <EmojiRedCross />}
                </td>
                <td>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDelete(service._id)}
                    style={{ cursor: 'pointer' }}
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
