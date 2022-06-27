package ro.unibuc.dbapp.service.impl;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import ro.unibuc.dbapp.model.IotGateway;
import ro.unibuc.dbapp.repo.IotGatewayRepository;
import ro.unibuc.dbapp.service.api.HomeService;
import ro.unibuc.dbapp.service.api.IotGatewayService;
import ro.unibuc.dbapp.service.api.RoomService;
import ro.unibuc.dbapp.utils.JwtUtils;
import ro.unibuc.dbapp.web.dto.*;
import ro.unibuc.dbapp.web.error.GatewayDeleteException;
import ro.unibuc.dbapp.web.error.GatewayEditException;
import ro.unibuc.dbapp.web.error.GatewayPairException;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class IotGatewayServiceImpl implements IotGatewayService {

    private final IotGatewayRepository repository;
    private final RoomService roomService;
    private final HomeService homeService;
    private final Map<String, IotGateway> gwPairingMode;

    public IotGatewayServiceImpl(IotGatewayRepository repository, RoomService roomService, HomeService homeService) {
        this.repository = repository;
        this.roomService = roomService;
        this.homeService = homeService;
        this.gwPairingMode = new ConcurrentHashMap<>();
    }

    @Override
    public IotGatewayReturn signal(IotGatewaySignal gw, Jwt jwt) {
        var machineId = JwtUtils.getUserId(jwt);
        var optional = repository.findById(machineId);

        var item = optional.orElseGet(() -> {
            var obj = new IotGateway();
            obj.setMachineId(machineId);
            obj.setFriendlyName(machineId);
            obj.setType(gw.getType());
            obj.setSensors(gw.getSensors());

            gwPairingMode.putIfAbsent(gw.getPairCode(), obj);

            return obj;
        });

        return new IotGatewayReturn(item);
    }

    @Override
    public Iterable<IotGatewayReturn> pair(IotGatewayPair gw, Jwt jwt) throws GatewayPairException {
        if (!gwPairingMode.containsKey(gw.getPairCode())) {
            throw new GatewayPairException("Machine is not in pairing mode!");
        }

        var optional = Optional.of(gwPairingMode.remove(gw.getPairCode()));
        var item = optional.orElseThrow(() -> new GatewayPairException("Machine is not in pairing mode!"));
        if (!item.getMachineId().equals(gw.getMachineId())) {
            throw new GatewayPairException("Bad payload!");
        }

        var userId = JwtUtils.getUserId(jwt);
        var home = homeService.get(jwt);

        var defaultRoom = roomService.getDefault(jwt);
        var sensorList = item.getSensors();
        sensorList.forEach(sensor -> {
            sensor.setGateway(item);
            sensor.setRoom(defaultRoom);
        });

        var dbItem = new IotGateway(item.getMachineId(), userId, item.getFriendlyName(),
                item.getType(), item.getSensors(), home);

        repository.save(dbItem);

        return getPaired(jwt);
    }

    @Override
    public Iterable<IotGatewayReturn> edit(IotGatewayEdit gw, Jwt jwt) throws GatewayEditException {
        var optional = repository.findById(gw.getMachineId());
        var item = optional.orElseThrow(() -> new GatewayEditException("Machine doesn't exist"));

        var userId = JwtUtils.getUserId(jwt);

        if (!item.getPairedTo().equals(userId)) {
            throw new GatewayEditException("Incorrect Machine");
        }

        item.setFriendlyName(gw.getFriendlyName());
        repository.save(item);

        return getPaired(jwt);
    }

    @Override
    public Iterable<IotGatewayReturn> getPaired(Jwt jwt) {
        var userId = JwtUtils.getUserId(jwt);
        var iterable = repository.findAllByPairedTo(userId);

        return StreamSupport
                .stream(iterable.spliterator(), false)
                .map(IotGatewayReturn::new)
                .collect(Collectors.toList());

    }

    @Override
    public void delete(IotGatewayDelete gw, Jwt jwt) throws GatewayDeleteException {
        var optional = repository.findById(gw.getMachineId());
        var item = optional.orElseThrow(() -> new GatewayDeleteException("Machine doesn't exist"));

        var userId = JwtUtils.getUserId(jwt);

        if (!item.getPairedTo().equals(userId)) {
            throw new GatewayDeleteException("Incorrect Machine");
        }

        repository.delete(item);
    }
}
