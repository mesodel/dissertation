package ro.unibuc.dbapp.utils;

import org.springframework.security.oauth2.jwt.Jwt;

public class JwtUtils {

    private static final String AUTH_PREFIX = "auth0|";
    private static final String AUTH_SUFFIX = "@clients";

    public static String getUserId(Jwt jwt) {
        var actualUserId = (String) jwt.getClaims().get("sub");
        if(actualUserId.contains(AUTH_PREFIX)) {
            actualUserId = actualUserId.substring(AUTH_PREFIX.length());
        }
        if(actualUserId.contains(AUTH_SUFFIX)) {
            actualUserId = actualUserId.substring(0, actualUserId.indexOf(AUTH_SUFFIX));
        }

        return actualUserId;
    }
}
