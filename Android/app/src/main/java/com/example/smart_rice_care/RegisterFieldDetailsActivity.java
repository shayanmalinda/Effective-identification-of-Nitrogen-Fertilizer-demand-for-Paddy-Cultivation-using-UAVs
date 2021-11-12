package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.IOException;
import java.io.InputStream;

public class RegisterFieldDetailsActivity extends AppCompatActivity {

    Spinner ddn_province,ddn_district,ddn_division;

    String[] provinces= new String[9];
    String[] districts = new String[25];
    String[] divisions = new String[]{"Southern", "Northern", "Western"};


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

        ddn_province=findViewById(R.id.spProvince);
        ddn_district=findViewById(R.id.spDistrict);
        ddn_division=findViewById(R.id.spDivision);

        InputStream is = getResources().openRawResource(R.raw.admin_divisions);
        try {
            JSONObject object = new JSONObject(readJSON(is));
            JSONArray prov=object.getJSONArray("provinces");
            JSONArray distr=object.getJSONArray("districts");
            //System.out.println(prov.getString(1));
            for(int i=0;i<prov.length();i++){
                provinces[i]=prov.getString(i);
            }

            for(int i=0;i<distr.length();i++){
                districts[i]=distr.getString(i);
            }

            //provinces=prov.toString().split(",");
            is.close();
        } catch (JSONException | IOException e) {
            e.printStackTrace();
        }


        ArrayAdapter<String> province_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, provinces);
        ddn_province.setAdapter(province_adapter);

        ArrayAdapter<String> district_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, districts);
        ddn_district.setAdapter(district_adapter);

        ArrayAdapter<String> division_adapter = new ArrayAdapter<>(this, android.R.layout.simple_spinner_dropdown_item, divisions);
        ddn_division.setAdapter(division_adapter);
    }
}