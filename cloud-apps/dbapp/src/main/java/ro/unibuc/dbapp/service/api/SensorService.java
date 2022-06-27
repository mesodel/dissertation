package ro.unibuc.dbapp.service.api;

import org.springframework.security.oauth2.jwt.Jwt;
import ro.unibuc.dbapp.model.Sensor;
import ro.unibuc.dbapp.web.dto.SensorDto;
import ro.unibuc.dbapp.web.dto.SensorEdit;
import ro.unibuc.dbapp.web.error.GatewayGeneralException;

public interface SensorService {

    Iterable<SensorDto> getAllByGateway(String gwId, Jwt jwt) throws GatewayGeneralException;

    Sensor getOne(long id, Jwt jwt) throws GatewayGeneralException;

    SensorDto edit(long id, SensorEdit newItem, Jwt jwt) throws GatewayGeneralException;
}
