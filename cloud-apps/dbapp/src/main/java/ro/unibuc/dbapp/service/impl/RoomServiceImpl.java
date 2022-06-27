package ro.unibuc.dbapp.service.impl;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import ro.unibuc.dbapp.model.Room;
import ro.unibuc.dbapp.repo.RoomRepository;
import ro.unibuc.dbapp.service.api.HomeService;
import ro.unibuc.dbapp.service.api.RoomService;
import ro.unibuc.dbapp.web.dto.RoomModify;

import java.util.NoSuchElementException;

@Service
public class RoomServiceImpl implements RoomService {

    private static final String DEFAULT_ROOM_NAME = "Default";

    private final RoomRepository repository;
    private final HomeService homeService;

    public RoomServiceImpl(RoomRepository repository, HomeService homeService) {
        this.repository = repository;
        this.homeService = homeService;
    }

    @Override
    public Iterable<Room> save(RoomModify item, Jwt jwt) {
        var home = homeService.get(jwt);
        var room = new Room();
        room.setName(item.getName());
        room.setHome(home);

        repository.save(room);

        return getAll(jwt);
    }

    @Override
    public Iterable<Room> getAll(Jwt jwt) {
        var home = homeService.get(jwt);

        return repository.findAllByHome(home);
    }

    @Override
    public Room getOne(long id, Jwt jwt) {
        var home = homeService.get(jwt);
        var optional = repository.findById(id);
        var item = optional.orElseThrow(NoSuchElementException::new);

        if (!item.getHome().equals(home)) {
            throw new SecurityException();
        }

        return item;
    }

    @Override
    public Room getDefault(Jwt jwt) {
        var home = homeService.get(jwt);
        var optional = repository.findByHomeAndName(home, DEFAULT_ROOM_NAME);

        return optional.orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Iterable<Room> edit(long id, RoomModify item, Jwt jwt) {
        var dbItem = getOne(id, jwt);
        if (dbItem.getName().equals(DEFAULT_ROOM_NAME)) {
            throw new SecurityException();
        }

        dbItem.setName(item.getName());
        repository.save(dbItem);

        return getAll(jwt);
    }

    @Override
    public Iterable<Room> delete(long id, Jwt jwt) {
        var dbItem = getOne(id, jwt);
        repository.delete(dbItem);

        return getAll(jwt);
    }
}
