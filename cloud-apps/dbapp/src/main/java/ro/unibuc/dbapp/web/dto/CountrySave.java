package ro.unibuc.dbapp.web.dto;

import lombok.Data;

import javax.validation.constraints.Size;

@Data
public class CountrySave {

    @Size(min = 5, max = 30)
    private String name;
}
