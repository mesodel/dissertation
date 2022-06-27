package ro.unibuc.dbapp.web.dto;

import lombok.Data;

import javax.validation.constraints.NotBlank;

@Data
public class RoomModify {

    @NotBlank
    private String name;
}
