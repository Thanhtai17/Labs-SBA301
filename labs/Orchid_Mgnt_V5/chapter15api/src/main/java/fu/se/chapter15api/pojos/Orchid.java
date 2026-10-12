package fu.se.chapter15api.pojos;

import com.fasterxml.jackson.annotation.JsonAlias;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;

@Entity
@Table(name = "Orchid")
public class Orchid {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrchidID")
    @JsonProperty("orchidId")
    @JsonAlias({"orchidID", "OrchidID"})
    private Integer orchidId;

    @Column(name = "OrchidName", nullable = false, length = 100)
    @JsonProperty("orchidName")
    @JsonAlias({"orchidName", "OrchidName"})
    private String orchidName;

    @Column(name = "IsNatural", nullable = false)
    @JsonProperty("natural")
    @JsonAlias({"isNatural", "natural", "IsNatural"})
    private boolean isNatural;

    @Column(name = "OrchidDescription", length = 500)
    @JsonProperty("orchidDescription")
    @JsonAlias({"orchidDescription", "OrchidDescription"})
    private String orchidDescription;

    @Column(name = "OrchidCategory", length = 100)
    @JsonProperty("orchidCategory")
    @JsonAlias({"orchidCategory", "OrchidCategory"})
    private String orchidCategory;

    @Column(name = "IsAttractive", nullable = false)
    @JsonProperty("attractive")
    @JsonAlias({"isAttractive", "attractive", "IsAttractive"})
    private boolean isAttractive;

    @Column(name = "OrchidURL", length = 500)
    @JsonProperty("orchidURL")
    @JsonAlias({"orchidURL", "orchidUrl", "OrchidURL"})
    private String orchidURL;

    public Orchid() {}

    public Orchid(Integer orchidId, String orchidName, boolean isNatural, String orchidDescription, String orchidCategory, boolean isAttractive, String orchidURL) {
        this.orchidId = orchidId;
        this.orchidName = orchidName;
        this.isNatural = isNatural;
        this.orchidDescription = orchidDescription;
        this.orchidCategory = orchidCategory;
        this.isAttractive = isAttractive;
        this.orchidURL = orchidURL;
    }

    public Integer getOrchidId() {
        return orchidId;
    }

    public void setOrchidId(Integer orchidId) {
        this.orchidId = orchidId;
    }

    public String getOrchidName() {
        return orchidName;
    }

    public void setOrchidName(String orchidName) {
        this.orchidName = orchidName;
    }

    public boolean isNatural() {
        return isNatural;
    }

    public void setNatural(boolean natural) {
        isNatural = natural;
    }

    public String getOrchidDescription() {
        return orchidDescription;
    }

    public void setOrchidDescription(String orchidDescription) {
        this.orchidDescription = orchidDescription;
    }

    public String getOrchidCategory() {
        return orchidCategory;
    }

    public void setOrchidCategory(String orchidCategory) {
        this.orchidCategory = orchidCategory;
    }

    public boolean isAttractive() {
        return isAttractive;
    }

    public void setAttractive(boolean attractive) {
        isAttractive = attractive;
    }

    public String getOrchidURL() {
        return orchidURL;
    }

    public void setOrchidURL(String orchidURL) {
        this.orchidURL = orchidURL;
    }
}
