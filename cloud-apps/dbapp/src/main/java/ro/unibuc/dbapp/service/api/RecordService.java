package ro.unibuc.dbapp.service.api;

import org.springframework.data.domain.PageRequest;
import org.springframework.security.oauth2.jwt.Jwt;
import ro.unibuc.dbapp.web.dto.RecordDto;
import ro.unibuc.dbapp.web.dto.RecordSave;
import ro.unibuc.dbapp.web.error.GatewayGeneralException;

import java.util.List;

public interface RecordService {

    RecordDto save(RecordSave item, Jwt jwt) throws GatewayGeneralException;

    Iterable<RecordDto> getAll(long sensorId, PageRequest page, Jwt jwt) throws GatewayGeneralException;

    Iterable<RecordDto> getLatest(List<Long> sensorIds, Jwt jwt);
}
