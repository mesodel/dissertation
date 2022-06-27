package ro.unibuc.dbapp.service.impl;

import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import ro.unibuc.dbapp.model.Home;
import ro.unibuc.dbapp.model.Room;
import ro.unibuc.dbapp.repo.HomeRepository;
import ro.unibuc.dbapp.repo.RoomRepository;
import ro.unibuc.dbapp.service.api.HomeService;
import ro.unibuc.dbapp.utils.JwtUtils;
import ro.unibuc.dbapp.web.dto.HomeEdit;
import ro.unibuc.dbapp.web.dto.HomeSave;

import java.util.NoSuchElementException;

@Service
public class HomeServiceImpl implements HomeService {
    private static final String DEFAULT_NAME = "Default";

    private final HomeRepository repository;
    private final RoomRepository roomRepository;

    public HomeServiceImpl(HomeRepository repository, RoomRepository roomRepository) {
        this.repository = repository;
        this.roomRepository = roomRepository;
    }

    @Override
    public Home save(HomeSave item, Jwt jwt) {
        var dbItem = new Home();
        dbItem.setName(item.getName());
        dbItem.setCity(item.getCity());

        var userId = JwtUtils.getUserId(jwt);

        dbItem.setAssociatedTo(userId);

        var result = repository.save(dbItem);
        var room = new Room();
        room.setName(DEFAULT_NAME);
        room.setHome(result);
        roomRepository.save(room);

        return result;
    }

    @Override
    public Home get(Jwt jwt) {
        var userId = JwtUtils.getUserId(jwt);

        var optional = repository.findByAssociatedTo(userId);

        return optional.orElseThrow(NoSuchElementException::new);
    }

    @Override
    public Home edit(HomeEdit item, Jwt jwt) {
        var dbItem = get(jwt);
        dbItem.setName(item.getName());

        return repository.save(dbItem);
    }
}
