package com.example.smart_rice_care;

import androidx.annotation.RawRes;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.JsonReader;
import android.util.Log;
import android.widget.ArrayAdapter;
import android.widget.Spinner;

import com.google.android.gms.maps.model.LatLng;
import com.google.maps.android.heatmaps.WeightedLatLng;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.FileReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.util.ArrayList;
import java.util.List;
import java.util.Scanner;

public class Register2Activity extends AppCompatActivity {

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
        setContentView(R.layout.activity_register2);

        ddn_province=findViewById(R.id.province);
        ddn_district=findViewById(R.id.district);
        ddn_division=findViewById(R.id.division);

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