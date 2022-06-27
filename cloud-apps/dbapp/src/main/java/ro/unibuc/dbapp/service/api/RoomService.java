package ro.unibuc.dbapp.service.api;

import org.springframework.security.oauth2.jwt.Jwt;
import ro.unibuc.dbapp.model.Room;
import ro.unibuc.dbapp.web.dto.RoomModify;

public interface RoomService {

    Iterable<Room> save(RoomModify item, Jwt jwt);

    Iterable<Room> getAll(Jwt jwt);

    Room getOne(long id, Jwt jwt);

    Room getDefault(Jwt jwt);

    Iterable<Room> edit(long id, RoomModify item, Jwt jwt);

    Iterable<Room> delete(long id, Jwt jwt);
}
