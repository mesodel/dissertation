package ro.unibuc.dbapp.web.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import javax.validation.constraints.NotBlank;

@AllArgsConstructor
@Data
public class IotGatewayEdit {

    @NotBlank
    private String machineId;

    @NotBlank
    private String friendlyName;
}
