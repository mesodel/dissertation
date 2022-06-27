package ro.unibuc.dbapp.repo;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import ro.unibuc.dbapp.model.IotGateway;
import ro.unibuc.dbapp.model.Sensor;

@Repository
public interface SensorRepository extends CrudRepository<Sensor, Long> {

    Iterable<Sensor> findAllByGateway(IotGateway gw);
}
