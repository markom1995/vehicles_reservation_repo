package ba.telegroup.vehicles_reservation.util;

public class FileInformation {

    private String name;
    private byte[] content;

    public FileInformation() {}

    public FileInformation(String name, byte[] content) {
        this.name = name;
        this.content = content;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public byte[] getContent() {
        return content;
    }

    public void setContent(byte[] content) {
        this.content = content;
    }
}
