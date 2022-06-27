package ro.unibuc.dbapp.service.impl;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import ro.unibuc.dbapp.model.Sensor;
import ro.unibuc.dbapp.repo.IotGatewayRepository;
import ro.unibuc.dbapp.repo.SensorRepository;
import ro.unibuc.dbapp.service.api.RoomService;
import ro.unibuc.dbapp.service.api.SensorService;
import ro.unibuc.dbapp.utils.JwtUtils;
import ro.unibuc.dbapp.web.dto.SensorDto;
import ro.unibuc.dbapp.web.dto.SensorEdit;
import ro.unibuc.dbapp.web.error.GatewayGeneralException;

import java.util.NoSuchElementException;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class SensorServiceImpl implements SensorService {

    private final SensorRepository repository;
    private final IotGatewayRepository gwRepository;
    private final RoomService roomService;

    public SensorServiceImpl(SensorRepository repository, IotGatewayRepository gwRepository, RoomService roomService) {
        this.repository = repository;
        this.gwRepository = gwRepository;
        this.roomService = roomService;
    }

    @Override
    public Iterable<SensorDto> getAllByGateway(String gwId, Jwt jwt) throws GatewayGeneralException {
        var optional = gwRepository.findById(gwId);
        var dbGateway = optional.orElseThrow(NoSuchElementException::new);

        var userId = JwtUtils.getUserId(jwt);

        if(!dbGateway.getPairedTo().equals(userId)) {
            throw new GatewayGeneralException("No such Machine!");
        }

        var iterable = repository.findAllByGateway(dbGateway);

        return StreamSupport
                .stream(iterable.spliterator(), false)
                .map(SensorDto::new)
                .collect(Collectors.toList());
    }

    @Override
    public Sensor getOne(long id, Jwt jwt) throws GatewayGeneralException {
        var optional = repository.findById(id);
        var item = optional.orElseThrow(NoSuchElementException::new);

        var actualUserId = JwtUtils.getUserId(jwt);

        var expectedUserId = item.getGateway().getPairedTo();
        var expectedMachineId = item.getGateway().getMachineId();
        if(!actualUserId.equals(expectedUserId) && !actualUserId.equals(expectedMachineId)) {
            throw new GatewayGeneralException("No such Machine!");
        }

        return item;
    }

    @Override
    public SensorDto edit(long id, SensorEdit newItem, Jwt jwt) throws GatewayGeneralException {
        var optional = repository.findById(id);
        var item = optional.orElseThrow(NoSuchElementException::new);

        var expectedUser = item.getRoom().getHome().getAssociatedTo();
        var actualUser = JwtUtils.getUserId(jwt);

        if(!actualUser.equals(expectedUser)) {
            throw new GatewayGeneralException("No such Machine!");
        }

        var room = roomService.getOne(newItem.getRoomId(), jwt);
        item.setDescription(newItem.getDescription());
        item.setRoom(room);
        item = repository.save(item);

        return new SensorDto(item);
    }
}
