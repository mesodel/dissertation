package ro.unibuc.dwapp.task;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import ro.unibuc.dwapp.service.api.RecordService;

@Component
public class DataMigrationTask {

    private final RecordService service;

    public DataMigrationTask(RecordService service) {
        this.service = service;
    }

    @Scheduled(cron = "0 22 * * *")
    public void migrateData() {
        service.migrateData();
    }
}
