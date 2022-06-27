package ro.unibuc.dbapp.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ro.unibuc.dbapp.model.Home;

import java.util.Optional;

@Repository
public interface HomeRepository extends CrudRepository<Home, Long> {

    Optional<Home> findByAssociatedTo(String pairedTo);
}
