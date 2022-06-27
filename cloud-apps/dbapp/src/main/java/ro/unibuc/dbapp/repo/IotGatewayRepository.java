package ro.unibuc.dbapp.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ro.unibuc.dbapp.model.IotGateway;

@Repository
public interface IotGatewayRepository extends CrudRepository<IotGateway, String> {

    Iterable<IotGateway> findAllByPairedTo(String pairedTo);
}
