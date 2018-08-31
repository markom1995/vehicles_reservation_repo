package ba.telegroup.vehicles_reservation.util;

import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.util.JRSaver;
import org.springframework.beans.factory.annotation.Value;

import javax.annotation.Resource;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;

public class Util {

    private static final String alphaNumericString = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
    private static SecureRandom random = new SecureRandom();

    public static String hashPassword(String passwordToHash){
        String generatedPassword = null;
        try {
            MessageDigest messageDigest = MessageDigest.getInstance("SHA-512");
            byte[] bytes = messageDigest.digest(passwordToHash.getBytes(StandardCharsets.UTF_8));
            StringBuilder stringBuilder = new StringBuilder();
            for(int i=0; i< bytes.length ;i++){
                stringBuilder.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }

            generatedPassword = stringBuilder.toString();
        }
        catch (NoSuchAlgorithmException e){
            e.printStackTrace();
        }

        return generatedPassword;
    }

    public static String randomString(int length){
        StringBuilder stringBuilder = new StringBuilder(length);
        for(int i = 0; i < length; i++){
            stringBuilder.append(alphaNumericString.charAt(random.nextInt(alphaNumericString.length())));
        }

        return stringBuilder.toString();
    }

    /*public void compileJRTemplate() throws JRException {
        if(!Files.exists(Paths.get("classpath:reports/Vehicle_Maintenance_All.jasper"))){
            InputStream vehicleMaintenanceAllJR = getClass().getResourceAsStream("classpath:reports/Vehicle_Maintenance_All.jrxml");
            JasperReport jasperReport = JasperCompileManager.compileReport(vehicleMaintenanceAllJR);
            JRSaver.saveObject(jasperReport, "classpath:reports/Vehicle_Maintenance_All.jasper");
        }
    }*/
}
