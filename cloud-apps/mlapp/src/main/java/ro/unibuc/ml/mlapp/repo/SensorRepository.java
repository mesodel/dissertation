package ro.unibuc.ml.mlapp.repo;

import org.springframework.data.repository.CrudRepository;
import ro.unibuc.ml.mlapp.model.Sensor;

public interface SensorRepository extends CrudRepository<Sensor, Long> {
}
