package ro.unibuc.dbapp.repo;

import org.springframework.data.repository.CrudRepository;
import ro.unibuc.dbapp.model.City;
import ro.unibuc.dbapp.model.Country;

public interface CityRepository extends CrudRepository<City, Long> {

    Iterable<City> findAllByCountry(Country country);
}
