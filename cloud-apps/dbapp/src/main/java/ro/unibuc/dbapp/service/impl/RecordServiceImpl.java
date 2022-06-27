package ro.unibuc.dbapp.service.impl;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import ro.unibuc.dbapp.model.Record;
import ro.unibuc.dbapp.repo.RecordRepository;
import ro.unibuc.dbapp.service.api.RecordService;
import ro.unibuc.dbapp.service.api.SensorService;
import ro.unibuc.dbapp.utils.JwtUtils;
import ro.unibuc.dbapp.web.dto.RecordDto;
import ro.unibuc.dbapp.web.dto.RecordSave;
import ro.unibuc.dbapp.web.error.GatewayGeneralException;

import java.sql.Date;
import java.time.Instant;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class RecordServiceImpl implements RecordService {

    private final RecordRepository repository;
    private final SensorService sensorService;

    public RecordServiceImpl(RecordRepository repository, SensorService sensorService) {
        this.repository = repository;
        this.sensorService = sensorService;
    }

    @Override
    public RecordDto save(RecordSave item, Jwt jwt) throws GatewayGeneralException {
        var sensor = sensorService.getOne(item.getSensor().getId(), jwt);

        var record = new Record();
        record.setSensor(sensor);
        record.setValue(item.getValue());
        record.setDate(Date.from(Instant.now()));

        var result = repository.save(record);

        return new RecordDto(result);
    }

    @Override
    public Iterable<RecordDto> getAll(long sensorId, PageRequest page, Jwt jwt) throws GatewayGeneralException {
        var sensor = sensorService.getOne(sensorId, jwt);
        var result = repository.findAllBySensorOrderByDateDesc(sensor, page);

        return result
                .stream()
                .map(RecordDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Iterable<RecordDto> getLatest(List<Long> sensorIds, Jwt jwt) {
        var actualUserId = JwtUtils.getUserId(jwt);
        var result = repository.findLatestBySensorIds(sensorIds, actualUserId, sensorIds.size());

        return result
                .stream()
                .map(RecordDto::new)
                .collect(Collectors.toList());
    }
}
