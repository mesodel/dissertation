package ro.unibuc.dbapp.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class IotGatewayDelete {

    @NotBlank
    private String machineId;
}
