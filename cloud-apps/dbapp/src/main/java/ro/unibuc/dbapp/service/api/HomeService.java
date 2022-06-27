package ro.unibuc.dbapp.service.api;

import org.springframework.security.oauth2.jwt.Jwt;
import ro.unibuc.dbapp.model.Home;
import ro.unibuc.dbapp.web.dto.HomeEdit;
import ro.unibuc.dbapp.web.dto.HomeSave;

public interface HomeService {

    Home save(HomeSave item, Jwt jwt);

    Home get(Jwt jwt);

    Home edit(HomeEdit item, Jwt jwt);
}
