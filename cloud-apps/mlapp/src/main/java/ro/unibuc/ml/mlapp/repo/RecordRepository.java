package ro.unibuc.ml.mlapp.repo;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.PagingAndSortingRepository;
import ro.unibuc.ml.mlapp.model.Record;

import java.util.List;

public interface RecordRepository extends PagingAndSortingRepository<Record, Long> {

    @Query(value="select r.*,\n" +
            "row_number() over (partition by to_char(r.record_date, 'HH24') order by record_date desc) rn\n" +
            "from record r\n" +
            "where sensor_id = ?1\n" +
            "order by rn asc\n" +
            "fetch first 24 rows only;", nativeQuery = true)
    List<Record> retrieveInputData(long sensorId);
}
