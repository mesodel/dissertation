package ro.unibuc.dbapp.config.converter;

import org.springframework.core.convert.converter.Converter;
import ro.unibuc.dbapp.model.IotGatewayType;

public class StringToTypeConverter implements Converter<String, IotGatewayType> {
    @Override
    public IotGatewayType convert(String source) {
        return IotGatewayType.valueOf(source);
    }
}
