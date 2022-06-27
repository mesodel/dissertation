package ro.unibuc.dbapp.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dbapp.model.Room;
import ro.unibuc.dbapp.service.api.RoomService;
import ro.unibuc.dbapp.web.dto.RoomModify;

import javax.validation.Valid;

@RestController
@RequestMapping("/room")
public class RoomController {

    private final RoomService service;

    public RoomController(RoomService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Iterable<Room>> save(@RequestBody @Valid RoomModify item,
                                     @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(item, jwt));
    }

    @GetMapping("/")
    public ResponseEntity<Iterable<Room>> getAll(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.getAll(jwt));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Room> getOne(@PathVariable long id, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.getOne(id, jwt));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Iterable<Room>> edit(@PathVariable long id, @RequestBody @Valid RoomModify item,
                                     @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.edit(id, item, jwt));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Iterable<Room>> delete(@PathVariable long id,
                                       @AuthenticationPrincipal Jwt jwt) {
       return ResponseEntity
                .ok()
                .body( service.delete(id, jwt));
    }
}
