package ro.unibuc.dbapp.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dbapp.model.Home;
import ro.unibuc.dbapp.service.api.HomeService;
import ro.unibuc.dbapp.web.dto.HomeEdit;
import ro.unibuc.dbapp.web.dto.HomeSave;

import javax.validation.Valid;

@RestController
@RequestMapping("/home")
public class HomeController {

    private final HomeService service;

    public HomeController(HomeService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<Home> save(@RequestBody @Valid HomeSave item,
                                     @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(item, jwt));
    }

    @GetMapping("/")
    public ResponseEntity<Home> get(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.get(jwt));
    }

    @PutMapping("/")
    public ResponseEntity<Home> edit(@RequestBody @Valid HomeEdit item,
                                     @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.edit(item, jwt));
    }
}
