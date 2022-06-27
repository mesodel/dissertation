package ro.unibuc.dbapp.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class SensorEdit {

    @NotBlank
    private String description;

    private long roomId;
}
