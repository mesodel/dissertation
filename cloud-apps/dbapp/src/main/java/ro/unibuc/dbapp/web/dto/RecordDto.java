package ro.unibuc.dbapp.web.dto;

import lombok.Data;
import ro.unibuc.dbapp.model.Record;

import java.util.Date;

@Data
public class RecordDto {

    private long id;
    private double value;
    private Date date;
    private long sensorId;

    public RecordDto(Record record) {
        this.id = record.getId();
        this.value = record.getValue();
        this.date = record.getDate();
        this.sensorId = record.getSensor().getId();
    }
}
