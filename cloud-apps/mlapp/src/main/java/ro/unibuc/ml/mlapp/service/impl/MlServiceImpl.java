package ro.unibuc.ml.mlapp.service.impl;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import ro.unibuc.ml.mlapp.client.NnClient;
import ro.unibuc.ml.mlapp.repo.RecordRepository;
import ro.unibuc.ml.mlapp.repo.SensorRepository;
import ro.unibuc.ml.mlapp.service.api.MlService;

import java.util.ArrayList;
import java.util.List;

@Service
public class MlServiceImpl implements MlService {

    private static final short PAGE_NO = 0;
    private static final short PAGE_SIZE = 24;

    private final RecordRepository recordRepository;
    private final SensorRepository sensorRepository;
    private final NnClient nnClient;

    public MlServiceImpl(RecordRepository recordRepository, SensorRepository sensorRepository, NnClient nnClient) {
        this.recordRepository = recordRepository;
        this.sensorRepository = sensorRepository;
        this.nnClient = nnClient;
    }

    @Override
    public List<Double> predict(long sensorId) {
        var sensor = sensorRepository.findById(sensorId).orElseThrow();
        var values = recordRepository.retrieveInputData(sensor.getId());
        var request = values
                .stream()
                .map(record -> {
                    List<Double> list = new ArrayList<>();
                    list.add(record.getValue());
                    list.add((double) record.getTimestamp().getHours());

                    return list;
                }).toList();

        return nnClient.predict(request).get(0);
    }
}
