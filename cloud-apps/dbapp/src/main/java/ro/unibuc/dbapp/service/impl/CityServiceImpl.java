package ro.unibuc.dbapp.service.impl;

import org.springframework.stereotype.Service;
import ro.unibuc.dbapp.model.City;
import ro.unibuc.dbapp.model.Country;
import ro.unibuc.dbapp.repo.CityRepository;
import ro.unibuc.dbapp.service.api.CityService;
import ro.unibuc.dbapp.web.dto.CityEdit;
import ro.unibuc.dbapp.web.dto.CitySave;

import java.util.NoSuchElementException;

@Service
public class CityServiceImpl implements CityService {


    private final CityRepository repository;

    public CityServiceImpl(CityRepository repository) {
        this.repository = repository;
    }

    @Override
    public City save(CitySave item) {
        var dbItem = new City();
        dbItem.setName(item.getName());
        dbItem.setCountry(item.getCountry());

        return repository.save(dbItem);
    }

    @Override
    public Iterable<City> getAll(long id) {
        var country = new Country();
        country.setId(id);

        return repository.findAllByCountry(country);
    }

    @Override
    public City getOne(long id) {
        return repository.findById(id).orElseThrow(NoSuchElementException::new);
    }

    @Override
    public City edit(long id, CityEdit item) {
        var optional = repository.findById(id);
        var dbItem = optional.orElseThrow(NoSuchElementException::new);

        dbItem.setName(item.getName());

        return repository.save(dbItem);
    }

    @Override
    public void delete(long id) {
        var optional = repository.findById(id);
        var dbItem = optional.orElseThrow(NoSuchElementException::new);

        repository.delete(dbItem);
    }
}
