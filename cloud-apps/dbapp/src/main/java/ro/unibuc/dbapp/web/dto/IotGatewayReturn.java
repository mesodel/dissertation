package ro.unibuc.dbapp.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import ro.unibuc.dbapp.model.IotGateway;
import ro.unibuc.dbapp.model.IotGatewayType;

import java.util.List;
import java.util.stream.Collectors;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IotGatewayReturn {

    private String machineId;
    private String pairedTo;
    private String friendlyName;
    private IotGatewayType type;
    private List<SensorDto> sensors;

    public IotGatewayReturn(IotGateway gw) {
        this.machineId = gw.getMachineId();
        this.pairedTo = gw.getPairedTo();
        this.friendlyName = gw.getFriendlyName();
        this.type = gw.getType();

        this.sensors = gw
                .getSensors()
                .stream()
                .map(SensorDto::new)
                .collect(Collectors.toList());
    }
}
