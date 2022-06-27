package ro.unibuc.dbapp.web.error;

public abstract class GatewayException extends Exception{

    public GatewayException(String message) {
        super(message);
    }
}
