package ro.unibuc.dbapp.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ro.unibuc.dbapp.model.Country;

@Repository
public interface CountryRepository extends CrudRepository<Country, Long> {
}
