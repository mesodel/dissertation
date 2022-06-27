package ro.unibuc.dbapp.web.dto;

import lombok.Data;
import ro.unibuc.dbapp.model.City;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Size;

@Data
public class HomeSave {

    @Size(min = 3, max = 30)
    private String name;

    @NotNull
    private City city;
}
