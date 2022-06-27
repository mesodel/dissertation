package ro.unibuc.ml.mlapp.web;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ro.unibuc.ml.mlapp.service.api.MlService;

import java.util.List;

@RestController
@RequestMapping("/")
public class MlController {

    private final MlService service;

    public MlController(MlService service) {
        this.service = service;
    }

    @GetMapping("/predict/{sensorId}")
    public ResponseEntity<List<Double>> getPredictions(@PathVariable long sensorId) {
        return ResponseEntity
                .ok()
                .body(service.predict(sensorId));
    }
}
