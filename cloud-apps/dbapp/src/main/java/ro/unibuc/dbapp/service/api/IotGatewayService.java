package ro.unibuc.dbapp.service.api;

import org.springframework.security.oauth2.jwt.Jwt;

import ro.unibuc.dbapp.web.dto.*;
import ro.unibuc.dbapp.web.error.GatewayDeleteException;
import ro.unibuc.dbapp.web.error.GatewayEditException;
import ro.unibuc.dbapp.web.error.GatewayPairException;

public interface IotGatewayService {

    IotGatewayReturn signal(IotGatewaySignal gw, Jwt jwt);

    Iterable<IotGatewayReturn> pair(IotGatewayPair gw, Jwt jwt) throws GatewayPairException;

    Iterable<IotGatewayReturn> edit(IotGatewayEdit gw, Jwt jwt) throws GatewayEditException;

    Iterable<IotGatewayReturn> getPaired(Jwt jwt);

    void delete(IotGatewayDelete gw, Jwt jwt) throws GatewayDeleteException;
}
