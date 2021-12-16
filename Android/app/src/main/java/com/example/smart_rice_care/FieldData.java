package com.example.smart_rice_care;

public class FieldData {

    private Double latitude;
    private Double longitude;
    private Integer level;
    private String officerId;
    private String requestId;
    private Integer density;

    public FieldData(Double latitude, Double longitude, Integer level, String officerId, String requestId, Integer density) {
        this.latitude = latitude;
        this.longitude = longitude;
        this.level = level;
        this.officerId = officerId;
        this.requestId = requestId;
        this.density = density;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Integer getLevel() {
        return level;
    }

    public void setLevel(Integer level) {
        this.level = level;
    }

    public String getOfficerId() {
        return officerId;
    }

    public void setOfficerId(String officerId) {
        this.officerId = officerId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public Integer getDensity() {
        return density;
    }

    public void setDensity(Integer density) {
        this.density = density;
    }
}
