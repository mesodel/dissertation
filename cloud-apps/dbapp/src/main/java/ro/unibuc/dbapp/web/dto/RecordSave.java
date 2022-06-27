package ro.unibuc.dbapp.web.dto;

import lombok.Data;
import ro.unibuc.dbapp.model.Sensor;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Data
public class RecordSave {

    @Min(value = 0)
    private double value;

    @NotNull
    private Sensor sensor;
}
