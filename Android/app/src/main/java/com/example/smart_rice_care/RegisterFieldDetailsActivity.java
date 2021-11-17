package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Log;
import android.view.View;
import android.widget.AdapterView;
import android.widget.ArrayAdapter;
import android.widget.Spinner;
import android.widget.Toast;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.Collections;

public class RegisterFieldDetailsActivity extends AppCompatActivity {

    Spinner spProvince,spDistrict,spDivision;
    ArrayAdapter<String> provinceAdapter, districtAdapter, divisionAdapter;
    JSONObject divisionalSecretariats;

    ArrayList<String> provinces = new ArrayList<String>();
    ArrayList<String> districts = new ArrayList<String>();
    ArrayList<String> divisions = new ArrayList<String>();

    String selectedProvince, selectedDistrict, selectedDivision;

    public String readJSON(InputStream inputStream) {
        String json = null;
        try {
            int size = inputStream.available();
            byte[] buffer = new byte[size];
            // read values in the byte array
            inputStream.read(buffer);
            inputStream.close();
            // convert byte to string
            json = new String(buffer, "UTF-8");
        } catch (IOException e) {
            e.printStackTrace();
            return json;
        }
        return json;
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_field_details);

        spProvince = findViewById(R.id.spProvince);
        spDistrict = findViewById(R.id.spDistrict);
        spDivision = findViewById(R.id.spDivision);

        InputStream is = getResources().openRawResource(R.raw.divisional_secretariats);
        try {
            divisionalSecretariats = new JSONObject(readJSON(is));
            for(int i=0;i<divisionalSecretariats.getJSONArray("provinces").length();i++){
                provinces.add(String.valueOf(divisionalSecretariats.getJSONArray("provinces").get(i)));
            }
            Collections.sort(provinces);
            selectedProvince = provinces.get(0);
            for(int i=0;i<divisionalSecretariats.getJSONArray(selectedProvince).length();i++){
                districts.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedProvince).get(i)));
            }
            Collections.sort(districts);
            selectedDistrict = districts.get(0);

            for(int i=0;i<divisionalSecretariats.getJSONArray(selectedDistrict).length();i++){
                divisions.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedDistrict).get(i)));
            }
            Collections.sort(divisions);
            selectedDivision = divisions.get(0);

            is.close();
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }

        provinceAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, provinces);
        spProvince.setAdapter(provinceAdapter);

        districtAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, districts);
        spDistrict.setAdapter(districtAdapter);

        divisionAdapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, divisions);
        spDivision.setAdapter(districtAdapter);


        spProvince.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedProvince = provinces.get(position);
                try {
                    handleDistrictSelection();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        spDistrict.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedDistrict = districts.get(position);
                try {
                    handleDivisionSelection();
                } catch (JSONException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });

        spDivision.setOnItemSelectedListener(new AdapterView.OnItemSelectedListener() {
            @Override
            public void onItemSelected(AdapterView<?> parent, View view, int position, long id) {
                selectedDivision = divisions.get(position);
            }

            @Override
            public void onNothingSelected(AdapterView<?> parent) {

            }
        });


    }

//    public void handleProvinceSelection() throws JSONException {
//        handleDistrictSelection();
//    }
    public void handleDistrictSelection() throws JSONException {
        districts.clear();
        for(int i=0;i<divisionalSecretariats.getJSONArray(selectedProvince).length();i++){
            districts.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedProvince).get(i)));
        }
        Collections.sort(districts);
        selectedDistrict = districts.get(0);
        spDistrict.setAdapter(districtAdapter);
        handleDivisionSelection();
    }

    public void handleDivisionSelection() throws JSONException {

        divisions.clear();
        for(int i=0;i<divisionalSecretariats.getJSONArray(selectedDistrict).length();i++){
            divisions.add(String.valueOf(divisionalSecretariats.getJSONArray(selectedDistrict).get(i)));
        }
        Collections.sort(divisions);
        selectedDivision = divisions.get(0);
        spDivision.setAdapter(divisionAdapter);
    }

}