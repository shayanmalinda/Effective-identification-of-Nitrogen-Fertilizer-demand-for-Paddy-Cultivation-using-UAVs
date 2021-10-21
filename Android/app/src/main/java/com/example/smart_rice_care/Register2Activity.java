package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

public class Register2Activity extends AppCompatActivity {

    Spinner ddn_province,ddn_district,ddn_division;

    String[] provinces = new String[]{"Southern", "Northern", "Western"};
    String[] districts = new String[]{"Southern", "Northern", "Western"};
    String[] divisions = new String[]{"Southern", "Northern", "Western"};
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register2);

        ddn_province=findViewById(R.id.province);
        ddn_district=findViewById(R.id.district);
        ddn_division=findViewById(R.id.division);

        ArrayAdapter<String> province_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, provinces);
        ddn_province.setAdapter(province_adapter);

        ArrayAdapter<String> district_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, districts);
        ddn_district.setAdapter(district_adapter);

        ArrayAdapter<String> division_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, divisions);
        ddn_division.setAdapter(division_adapter);
    }
}