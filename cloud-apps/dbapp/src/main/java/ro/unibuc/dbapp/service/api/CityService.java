package ro.unibuc.dbapp.service.api;

import ro.unibuc.dbapp.model.City;
import ro.unibuc.dbapp.web.dto.CityEdit;
import ro.unibuc.dbapp.web.dto.CitySave;

public interface CityService {

    City save(CitySave item);

    Iterable<City> getAll(long id);

    City getOne(long id);

    City edit(long id, CityEdit item);

    void delete(long id);
}
