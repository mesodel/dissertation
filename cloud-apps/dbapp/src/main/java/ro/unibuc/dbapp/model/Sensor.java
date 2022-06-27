package ro.unibuc.dbapp.model;

import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@AllArgsConstructor
@NoArgsConstructor
@Entity
public class Sensor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;

    private String description;

    @ManyToOne
    @JoinColumn(name = "gateway_id")
    private IotGateway gateway;

    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;


    public long getId() {
        return this.id;
    }

    public String getName() {
        return this.name;
    }

    public String getDescription() {
        return this.description;
    }

    public IotGateway getGateway() {
        return this.gateway;
    }

    public Room getRoom() {
        return this.room;
    }

    public void setId(long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setGateway(IotGateway gateway) {
        this.gateway = gateway;
    }

    public void setRoom(Room room) {
        this.room = room;
    }

    public boolean equals(final Object o) {
        if (o == this) return true;
        if (!(o instanceof Sensor)) return false;
        final Sensor other = (Sensor) o;
        if (!other.canEqual((Object) this)) return false;
        if (this.getId() != other.getId()) return false;
        final Object this$name = this.getName();
        final Object other$name = other.getName();
        if (this$name == null ? other$name != null : !this$name.equals(other$name)) return false;
        final Object this$description = this.getDescription();
        final Object other$description = other.getDescription();
        if (this$description == null ? other$description != null : !this$description.equals(other$description))
            return false;
        final Object this$gateway = this.getGateway();
        final Object other$gateway = other.getGateway();
        if (this$gateway == null ? other$gateway != null : !this$gateway.equals(other$gateway)) return false;
        final Object this$room = this.getRoom();
        final Object other$room = other.getRoom();
        if (this$room == null ? other$room != null : !this$room.equals(other$room)) return false;
        return true;
    }

    protected boolean canEqual(final Object other) {
        return other instanceof Sensor;
    }

    public int hashCode() {
        final int PRIME = 59;
        int result = 1;
        final long $id = this.getId();
        result = result * PRIME + (int) ($id >>> 32 ^ $id);
        final Object $name = this.getName();
        result = result * PRIME + ($name == null ? 43 : $name.hashCode());
        final Object $description = this.getDescription();
        result = result * PRIME + ($description == null ? 43 : $description.hashCode());
        final Object $gateway = this.getGateway();
        result = result * PRIME + ($gateway == null ? 43 : $gateway.hashCode());
        final Object $room = this.getRoom();
        result = result * PRIME + ($room == null ? 43 : $room.hashCode());
        return result;
    }

    public String toString() {
        return "Sensor(id=" + this.getId() + ", name=" + this.getName() + ", description=" + this.getDescription() + ")";
    }
}
