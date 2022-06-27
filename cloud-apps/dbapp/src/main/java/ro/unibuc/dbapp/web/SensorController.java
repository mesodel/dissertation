package ro.unibuc.dbapp.web;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dbapp.model.IotGateway;
import ro.unibuc.dbapp.service.api.SensorService;
import ro.unibuc.dbapp.web.dto.SensorDto;
import ro.unibuc.dbapp.web.dto.SensorEdit;
import ro.unibuc.dbapp.web.error.GatewayGeneralException;

import javax.validation.Valid;

@RestController
@RequestMapping("/sensor")
public class SensorController {

    private final SensorService service;

    public SensorController(SensorService service) {
        this.service = service;
    }

    @GetMapping("/{gwId}")
    public ResponseEntity<Iterable<SensorDto>> getAll(@PathVariable String gwId,
                                                      @AuthenticationPrincipal Jwt jwt) throws GatewayGeneralException {
        return ResponseEntity
                .ok()
                .body(service.getAllByGateway(gwId, jwt));
    }

    @PutMapping("/{id}")
    public ResponseEntity<SensorDto> edit(@PathVariable long id, @RequestBody @Valid SensorEdit item,
                                          @AuthenticationPrincipal Jwt jwt) throws GatewayGeneralException {
        return ResponseEntity
                .ok()
                .body(service.edit(id, item, jwt));
    }
}
