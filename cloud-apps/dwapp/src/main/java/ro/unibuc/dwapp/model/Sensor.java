package ro.unibuc.dwapp.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String description;

    @Column(name = "machine_id")
    private String machineId;

    @Column(name = "gateway_friendly_name")
    private String friendlyName;

    @Column(name = "gateway_type")
    private IotGatewayType type;
}
