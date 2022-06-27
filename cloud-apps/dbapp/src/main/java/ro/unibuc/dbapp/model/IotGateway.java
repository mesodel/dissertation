package ro.unibuc.dbapp.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;
import javax.validation.constraints.NotBlank;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
@Entity
public class IotGateway {

    @Id
    @NotBlank
    private String machineId;

    private String pairedTo;

    private String friendlyName;

    private IotGatewayType type;

    @OneToMany(mappedBy = "gateway", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Sensor> sensors;

    @ManyToOne
    @JoinColumn(name = "home_id")
    private Home home;
}
