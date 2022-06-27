package ro.unibuc.dbapp.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Record {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private double value;

    @Column(name = "record_date")
    private Date date;

    @ManyToOne
    @JoinColumn(name = "sensor_id")
    Sensor sensor;
}
