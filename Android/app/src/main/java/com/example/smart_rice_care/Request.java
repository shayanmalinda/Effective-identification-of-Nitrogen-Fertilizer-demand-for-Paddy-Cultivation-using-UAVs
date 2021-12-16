package com.example.smart_rice_care;

import java.util.ArrayList;

public class Request {
    private String farmerId;
    private String fieldId;
    private String requestId;
    private String date;
    private String address;
    private String registrationNumber;
    private String farmerFirstName;
    private String farmerLastName;
    private String division;
    private String email;
    private String nic;
    private String phone;
    private Double longitude;
    private Double latitude;
    private String requestNote;

    public Request(String farmerId, String fieldId, String requestId, String date, String address, String registrationNumber, String farmerFirstName, String farmerLastName, String division, String email, String nic, String phone, Double longitude, Double latitude, String requestNote) {
        this.farmerId = farmerId;
        this.fieldId = fieldId;
        this.requestId = requestId;
        this.date = date;
        this.address = address;
        this.registrationNumber = registrationNumber;
        this.farmerFirstName = farmerFirstName;
        this.farmerLastName = farmerLastName;
        this.division = division;
        this.email = email;
        this.nic = nic;
        this.phone = phone;
        this.longitude = longitude;
        this.latitude = latitude;
        this.requestNote = requestNote;
    }

    public String getFarmerId() {
        return farmerId;
    }

    public void setFarmerId(String farmerId) {
        this.farmerId = farmerId;
    }

    public String getFieldId() {
        return fieldId;
    }

    public void setFieldId(String fieldId) {
        this.fieldId = fieldId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public String getDate() {
        return date;
    }

    public void setDate(String date) {
        this.date = date;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getFarmerFirstName() {
        return farmerFirstName;
    }

    public void setFarmerFirstName(String farmerFirstName) {
        this.farmerFirstName = farmerFirstName;
    }

    public String getFarmerLastName() {
        return farmerLastName;
    }

    public void setFarmerLastName(String farmerLastName) {
        this.farmerLastName = farmerLastName;
    }

    public String getDivision() {
        return division;
    }

    public void setDivision(String division) {
        this.division = division;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getNic() {
        return nic;
    }

    public void setNic(String nic) {
        this.nic = nic;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Double getLongitude() {
        return longitude;
    }

    public void setLongitude(Double longitude) {
        this.longitude = longitude;
    }

    public Double getLatitude() {
        return latitude;
    }

    public void setLatitude(Double latitude) {
        this.latitude = latitude;
    }

    public String getRequestNote() {
        return requestNote;
    }

    public void setRequestNote(String requestNote) {
        this.requestNote = requestNote;
    }

}
