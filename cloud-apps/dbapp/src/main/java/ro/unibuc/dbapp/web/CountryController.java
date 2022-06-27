package ro.unibuc.dbapp.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dbapp.model.Country;
import ro.unibuc.dbapp.service.api.CountryService;
import ro.unibuc.dbapp.web.dto.CountrySave;

import javax.validation.Valid;

@RestController
@RequestMapping("/country")
public class CountryController {

    private final CountryService service;

    public CountryController(CountryService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Country> save(@RequestBody @Valid CountrySave item) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(item));
    }

    @GetMapping("/")
    public ResponseEntity<Iterable<Country>> getAll() {
        return ResponseEntity
                .ok()
                .body(service.getAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Country> getOne(@PathVariable long id) {
        return ResponseEntity
                .ok()
                .body(service.getOne(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Country> edit(@PathVariable long id, @RequestBody @Valid CountrySave item) {
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
