package ro.unibuc.dbapp.repo;

import org.springframework.data.repository.CrudRepository;
import ro.unibuc.dbapp.model.Home;
import ro.unibuc.dbapp.model.Room;

import java.util.Optional;

public interface RoomRepository extends CrudRepository<Room, Long> {

    Iterable<Room> findAllByHome(Home home);

    Optional<Room> findByHomeAndName(Home home, String name);
}
