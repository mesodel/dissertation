package ro.unibuc.dwapp.model;

import lombok.Data;

import javax.persistence.*;

@Data
@Entity
public class Home {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(name = "home_name")
    private String homeName;

    @Column(name = "room_name")
    private String roomName;

}
