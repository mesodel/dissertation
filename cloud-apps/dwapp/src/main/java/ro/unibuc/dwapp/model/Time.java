package ro.unibuc.dwapp.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Data
@Entity
public class Time {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "reading_id")
    private long id;

    @Column(name = "full_date")
    private Date fullDate;

    private String year;

    private String month;

    private String day;

    private String quarter;
}
