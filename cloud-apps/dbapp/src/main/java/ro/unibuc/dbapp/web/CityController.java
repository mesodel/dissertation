package ro.unibuc.dbapp.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dbapp.model.City;
import ro.unibuc.dbapp.service.api.CityService;
import ro.unibuc.dbapp.web.dto.CityEdit;
import ro.unibuc.dbapp.web.dto.CitySave;

import javax.validation.Valid;

@RestController
@RequestMapping("/city")
public class CityController {

    private final CityService service;

    public CityController(CityService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<City> save(@RequestBody @Valid CitySave item) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(item));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Iterable<City>> getAll(@PathVariable long id) {
        return ResponseEntity
                .ok()
                .body(service.getAll(id));
    }

    @GetMapping("/one/{id}")
    public ResponseEntity<City> getOne(@PathVariable long id) {
        return ResponseEntity
                .ok()
                .body(service.getOne(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<City> edit(@PathVariable long id, @RequestBody @Valid CityEdit item) {
        return ResponseEntity
                .ok()
                .body(service.edit(id, item));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable long id) {
        service.delete(id);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(null);
    }
}
