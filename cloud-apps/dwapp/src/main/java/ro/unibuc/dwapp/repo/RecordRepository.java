package ro.unibuc.dwapp.repo;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.query.Procedure;
import org.springframework.stereotype.Repository;
import ro.unibuc.dwapp.model.Record;

@Repository
public interface RecordRepository extends JpaRepository<Record, Long> {

    @Query(value =
            "select avg(r.value) from record r inner join sensor s on s.id = r.sensor_id where s.id = ?1 and s.machine_id = ?2 and r.record_date >= SYSDATE - 1",
            nativeQuery = true)
    double getAverageValue(long sensorId, String pairedTo);

    @Query(value =
            "select min(r.value) from record r inner join sensor s on s.id = r.sensor_id where s.id = ?1 and s.machine_id = ?2 and r.record_date >= SYSDATE - 1",
            nativeQuery = true)
    double getMinValue(long sensorId, String pairedTo);

    @Query(value =
            "select max(r.value) from record r inner join sensor s on s.id = r.sensor_id where s.id = ?1 and s.machine_id = ?2 and r.record_date >= SYSDATE - 1",
            nativeQuery = true)
    double getMaxValue(long sensorId, String pairedTo);

    @Procedure("migrate_data")
    void callDataMigration();

    @Procedure("insert_time")
    void callTimeInsert();

    @Procedure("insert_records")
    void callRecordsInsert();
}
