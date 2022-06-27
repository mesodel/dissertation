package ro.unibuc.ml.mlapp.client;

import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

import java.util.List;

@FeignClient(name = "nn-client", url="${nn.uri}")
public interface NnClient {

    @RequestMapping(method = RequestMethod.POST, value = "/predict")
    List<List<Double>> predict(@RequestBody List<List<Double>> values);
}
