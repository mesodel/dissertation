package ro.unibuc.dbapp.repo;

import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import ro.unibuc.dbapp.model.Record;
import ro.unibuc.dbapp.model.Sensor;

import java.util.List;

public interface RecordRepository extends PagingAndSortingRepository<Record, Long> {

    List<Record> findAllBySensorOrderByDateDesc(Sensor sensor, Pageable pageable);

    @Query(value = "select r.*, row_number() over (partition by sensor_id order by record_date desc) rn\n" +
            "from record r\n" +
            "inner join sensor s on s.id = r.sensor_id\n" +
            "inner join iot_gateway gw on gw.machine_id = s.gateway_id\n" +
            "where gw.paired_to = ?2\n" +
            "and sensor_id in ?1\n" +
            "order by rn asc\n" +
            "fetch  first ?3 rows only", nativeQuery = true)
    List<Record> findLatestBySensorIds(List<Long> sensorIds, String pairedTo, int limit);
}
