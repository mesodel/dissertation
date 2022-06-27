package ro.unibuc.dwapp.service.api;

import org.springframework.security.oauth2.jwt.Jwt;

public interface RecordService {

    double getAvgValue(long sensorId, Jwt jwt);

    double getMinValue(long sensorId, Jwt jwt);

    double getMaxValue(long sensorId, Jwt jwt);

    void migrateData();

    void insertTime();

    void insertRecords();
}
