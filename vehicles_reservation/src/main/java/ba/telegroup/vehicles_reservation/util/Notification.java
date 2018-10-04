package ba.telegroup.vehicles_reservation.util;

import ba.telegroup.vehicles_reservation.common.exceptions.BadRequestException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Component;

import javax.mail.*;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeMessage;
import java.io.UnsupportedEncodingException;
import java.util.Properties;
import java.util.PropertyResourceBundle;
import java.util.ResourceBundle;

@Component
public class Notification {

    @Value("${mail.sender}")
    private String mailSender;

    @Value("${mail.password}")
    private String mailPassword;

    @Value("${mail.host}")
    private String mailHost;

    @Value("${mail.port}")
    private String mailPort;

    @Value("${mail.auth}")
    private String mailAuth;

    @Value("${mail.socketFactory.port}")
    private String mailSocketFactoryPort;

    @Value("${mail.socketFactory.class}")
    private String mailSocketFactoryClass;

    @Async
    public void notify(String recipientMail, String vehicleDetails, String reservationName, String direction, String time, Boolean startReservation) throws BadRequestException {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", mailHost);
        properties.put("mail.smtp.port", mailPort);
        properties.put("mail.smtp.auth", mailAuth);
        properties.put("mail.smtp.socketFactory.port", mailSocketFactoryPort);
        properties.put("mail.smtp.socketFactory.class", mailSocketFactoryClass);

        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(mailSender, mailPassword);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(mailSender, "Vehicle Reservation System"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientMail));
            message.setSubject("Notifikacija za rezervaciju");
            if(startReservation){
                message.setText("Vozilo " + vehicleDetails + " je rezervisano za rezervaciju pod imenom \"" + reservationName + "\" za pravac puta " + direction + " u periodu " + time + ".");
            }
            else{
                message.setText("Vozilo " + vehicleDetails + " je otkazano za rezervaciju pod imenom \"" + reservationName + "\" za pravac puta " + direction + " u periodu " + time + ".");
            }

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

    @Async
    public void sendRegistrationLink(String recipientMail, String registrationToken) throws BadRequestException {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", mailHost);
        properties.put("mail.smtp.port", mailPort);
        properties.put("mail.smtp.auth", mailAuth);
        properties.put("mail.smtp.socketFactory.port", mailSocketFactoryPort);
        properties.put("mail.smtp.socketFactory.class", mailSocketFactoryClass);

        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(mailSender, mailPassword);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(mailSender, "Vehicle Reservation System"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientMail));
            message.setSubject("Registracija");
            message.setText("Registraciju možete izvršiti na slijedećem linku http://localhost:8030 klikom na dugme registraciju. Vaš token je " + registrationToken + ".");

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

    @Async
    public void sendNewPassword(String recipientMail, String newPassword) throws BadRequestException {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", mailHost);
        properties.put("mail.smtp.port", mailPort);
        properties.put("mail.smtp.auth", mailAuth);
        properties.put("mail.smtp.socketFactory.port", mailSocketFactoryPort);
        properties.put("mail.smtp.socketFactory.class", mailSocketFactoryClass);

        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(mailSender, mailPassword);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(mailSender, "Vehicle Reservation System"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientMail));
            message.setSubject("Izmjena lozinke");
            message.setText("Vaša nova lozinka je " + newPassword + ". Molimo Vas da odmah poslije prvog prijavljivanja na sistem promijenite lozinku.");

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

    @Async
    public void sendActivationNotification(String recipientMail) throws BadRequestException {
        Properties properties = new Properties();
        properties.put("mail.smtp.host", mailHost);
        properties.put("mail.smtp.port", mailPort);
        properties.put("mail.smtp.auth", mailAuth);
        properties.put("mail.smtp.socketFactory.port", mailSocketFactoryPort);
        properties.put("mail.smtp.socketFactory.class", mailSocketFactoryClass);

        Session session = Session.getDefaultInstance(properties, new Authenticator() {
            protected PasswordAuthentication getPasswordAuthentication() {
                return new PasswordAuthentication(mailSender, mailPassword);
            }
        });

        try {
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(mailSender, "Vehicle Reservation System"));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(recipientMail));
            message.setSubject("Obavještenje");
            message.setText("Vaš nalog je odobren od strane administratora.");

            Transport.send(message);

        } catch (MessagingException | UnsupportedEncodingException e) {
            throw new BadRequestException("Recipient mail not found.");
        }
    }

}
