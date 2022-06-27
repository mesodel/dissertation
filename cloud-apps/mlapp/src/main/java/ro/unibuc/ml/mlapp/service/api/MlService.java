package ro.unibuc.ml.mlapp.service.api;

import java.util.List;

public interface MlService {

    List<Double> predict(long sensorId);
}
