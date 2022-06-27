package ro.unibuc.dwapp.web;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.web.bind.annotation.*;
import ro.unibuc.dwapp.service.impl.RecordServiceImpl;

@RestController
@RequestMapping("/")
public class Controller {

    private final RecordServiceImpl service;

    public Controller(RecordServiceImpl service) {
        this.service = service;
    }

    @GetMapping("/{sensorId}/avg")
    public ResponseEntity<Double> getAvgValue(@PathVariable("sensorId") long sensorId,
                                              @AuthenticationPrincipal Jwt jwt){

        return ResponseEntity.ok().body(service.getAvgValue(sensorId, jwt));
    }

    @GetMapping("/{sensorId}/min")
    public ResponseEntity<Double> getMinValue(@PathVariable("sensorId") long sensorId,
                                              @AuthenticationPrincipal Jwt jwt){

        return ResponseEntity.ok().body(service.getMinValue(sensorId, jwt));
    }

    @GetMapping("/{sensorId}/max")
    public ResponseEntity<Double> getMaxValue(@PathVariable("sensorId") long sensorId,
                                              @AuthenticationPrincipal Jwt jwt) {

        return ResponseEntity.ok().body(service.getMaxValue(sensorId, jwt));
    }

    @PutMapping("/triggerDataMigration")
    public ResponseEntity<String> callDataMigration() {
        service.migrateData();

        return ResponseEntity.ok().body("Data has been migrated successfully.");
    }

    @PutMapping("/insertTime")
    public ResponseEntity<String> callInsertTime() {
        service.insertTime();

        return ResponseEntity.ok().body("Time has been inserted successfully.");
    }

    @PutMapping("/insertRecords")
    public ResponseEntity<String> callInsertRecords() {
        service.insertRecords();

        return ResponseEntity.ok().body("Records have been inserted successfully.");
    }
}
