package ro.unibuc.dbapp.web.dto;

import lombok.Data;
import ro.unibuc.dbapp.model.IotGatewayType;
import ro.unibuc.dbapp.model.Sensor;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Data
public class IotGatewaySignal {

    @NotBlank
    private String pairCode;

    @NotNull
    private IotGatewayType type;

    @NotNull
    private List<Sensor> sensors;
}
