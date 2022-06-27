package ro.unibuc.dbapp.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Home {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(unique = true)
    private String associatedTo;

    @ManyToOne
    @JoinColumn(name = "city_id")
    private City city;
}
