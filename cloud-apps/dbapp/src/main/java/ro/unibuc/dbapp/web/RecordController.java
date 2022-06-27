package ro.unibuc.dbapp.web;

import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dbapp.service.api.RecordService;
import ro.unibuc.dbapp.web.dto.RecordDto;
import ro.unibuc.dbapp.web.dto.RecordSave;
import ro.unibuc.dbapp.web.error.GatewayGeneralException;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequestMapping("/record")
public class RecordController {

    private final RecordService service;

    public RecordController(RecordService service) {
        this.service = service;
    }

    @PostMapping("/save")
    public ResponseEntity<RecordDto> save(@RequestBody @Valid RecordSave item,
                                          @AuthenticationPrincipal Jwt jwt) throws GatewayGeneralException {
        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(service.save(item, jwt));
    }

    @GetMapping("/{sensorId}")
    public ResponseEntity<Iterable<RecordDto>> getAll(@PathVariable long sensorId,
                                                   @RequestParam(name = "pageSize", required = false, defaultValue = "50") int pageSize,
                                                   @RequestParam(name = "pageNo", required = false, defaultValue = "0") int pageNo,
                                                   @AuthenticationPrincipal Jwt jwt) throws GatewayGeneralException {
        return ResponseEntity
                .ok()
                .body(service.getAll(sensorId, PageRequest.of(pageNo, pageSize), jwt));
    }

    @GetMapping("/latest")
    public ResponseEntity<Iterable<RecordDto>> getLatest(@RequestParam List<Long> sensorIds, @AuthenticationPrincipal Jwt jwt) {
        return ResponseEntity
                .ok()
                .body(service.getLatest(sensorIds, jwt));
    }
}
