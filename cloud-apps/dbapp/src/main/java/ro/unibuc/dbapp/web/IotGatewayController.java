package ro.unibuc.dbapp.web;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dbapp.service.api.IotGatewayService;
import ro.unibuc.dbapp.web.dto.*;
import ro.unibuc.dbapp.web.error.GatewayDeleteException;
import ro.unibuc.dbapp.web.error.GatewayEditException;
import ro.unibuc.dbapp.web.error.GatewayPairException;

import javax.validation.Valid;

@RestController
@RequestMapping("/gw")
public class IotGatewayController {

    private final IotGatewayService service;

    public IotGatewayController(IotGatewayService service) {
        this.service = service;
    }

    @PostMapping("/signal")
    public ResponseEntity<IotGatewayReturn> signal(@RequestBody @Valid IotGatewaySignal gw,
                                                   @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.signal(gw, jwt));
    }

    @PostMapping("/pair")
    public ResponseEntity<Iterable<IotGatewayReturn>> pair(@RequestBody @Valid IotGatewayPair gw,
                                                           @AuthenticationPrincipal Jwt jwt) throws GatewayPairException {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.pair(gw, jwt));
    }

    @GetMapping("/")
    public ResponseEntity<Iterable<IotGatewayReturn>> getPaired(@AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.getPaired(jwt));
    }

    @PutMapping("/")
    public ResponseEntity<Iterable<IotGatewayReturn>> edit(@RequestBody @Valid IotGatewayEdit gw, @AuthenticationPrincipal Jwt jwt) throws GatewayEditException {
        return ResponseEntity
                .ok()
                .body(service.edit(gw, jwt));
    }

    @DeleteMapping("/")
    public ResponseEntity<Iterable<IotGatewayReturn>> delete(@RequestBody @Valid IotGatewayDelete gw,
                                                             @AuthenticationPrincipal Jwt jwt) throws GatewayDeleteException {
        service.delete(gw, jwt);

        return ResponseEntity
                .status(HttpStatus.NO_CONTENT)
                .body(null);
    }
}
