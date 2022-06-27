package ro.unibuc.dwapp.service.impl;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import ro.unibuc.dwapp.repo.RecordRepository;
import ro.unibuc.dwapp.service.api.RecordService;
import ro.unibuc.dwapp.utils.JwtUtils;

@Service
public class RecordServiceImpl implements RecordService {

    private final RecordRepository repository;

    public RecordServiceImpl(RecordRepository repository) {
        this.repository = repository;
    }

    @Override
    public double getAvgValue(long sensorId, Jwt jwt) {
        var userId = JwtUtils.getUserId(jwt);

        return repository.getAverageValue(sensorId, userId);
    }

    @Override
    public double getMinValue(long sensorId, Jwt jwt) {
        var userId = JwtUtils.getUserId(jwt);

        return repository.getMinValue(sensorId, userId);
    }

    @Override
    public double getMaxValue(long sensorId, Jwt jwt) {
        var userId = JwtUtils.getUserId(jwt);

        return repository.getMaxValue(sensorId, userId);
    }

    @Override
    public void migrateData() {
        repository.callDataMigration();
    }

    @Override
    public void insertTime() {
        repository.callTimeInsert();
    }

    @Override
    public void insertRecords() {
        repository.callRecordsInsert();
    }
}
