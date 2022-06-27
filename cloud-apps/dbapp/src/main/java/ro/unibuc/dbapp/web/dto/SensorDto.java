package ro.unibuc.dbapp.web.dto;

import lombok.Data;
import ro.unibuc.dbapp.model.Sensor;

@Data
public class SensorDto {

    private long id;
    private String name;
    private String description;

    public SensorDto(Sensor sensor) {
        this.id = sensor.getId();
        this.name = sensor.getName();
        this.description = sensor.getDescription();
    }
}
