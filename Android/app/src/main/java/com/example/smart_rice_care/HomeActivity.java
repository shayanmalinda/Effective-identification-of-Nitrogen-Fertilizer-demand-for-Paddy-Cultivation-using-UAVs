package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;

import android.content.SharedPreferences;
import android.os.Bundle;
import android.preference.PreferenceManager;
import android.util.Log;
import android.widget.Button;
import android.widget.Toast;

import com.google.android.gms.maps.model.LatLng;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.FirebaseFirestore;

import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class HomeActivity extends AppCompatActivity {

    Button btn_signin,btn_signup,btn_map,btn_myrequests,btn_capture;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);


        btn_signin = findViewById(R.id.button_signin);
        btn_signup = findViewById(R.id.button_signup);
        btn_map = findViewById(R.id.button_map);
        btn_myrequests = findViewById(R.id.button_myrequests);
        btn_capture=findViewById(R.id.button_capture);

        btn_signin.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this, SignInActivity.class);
                    startActivity(i);
                }
        );

        btn_signup.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this, RegisterUserDetailsActivity.class);
                    startActivity(i);
                }
        );

        btn_signup.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this, RegisterUserDetailsActivity.class);
                    startActivity(i);
                }
        );

        btn_map.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this, MapsActivity.class);
                    startActivity(i);
                }
        );

        btn_myrequests.setOnClickListener(

                v -> {


//                    SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
//                    String name = preferences.getString("SENSORTHRESHOLD", "");
//                    if(!name.equalsIgnoreCase(""))
//                    {
//                        Toast.makeText(this, ""+name, Toast.LENGTH_SHORT).show();
//                    }
                    Intent i = new Intent(HomeActivity.this, MyRequestsActivity.class);
                    startActivity(i);
                }
        );

        btn_capture.setOnClickListener(
                v -> {
                    Intent i=new Intent(HomeActivity.this,ImageCaptureActivity.class);
                    startActivity(i);
                }
        );

//        insertGPSCoordinates();
    }

    public void insertGPSCoordinates () {
        Double l2Lat[] = {6.071379,6.071379,6.071379,6.071379,6.071379,6.071404,6.071404,6.071404,6.071404,6.071404,6.071404,6.071404,6.071404,6.071404,6.071404,6.071404,6.071438,6.071438,6.071438,6.071438,6.071438,6.071438,6.071438,6.071438,6.071443,6.071443,6.071443,6.071443,6.071443,6.071443,6.071443,6.071443,6.071443,6.071541,6.071541,6.071384,6.071384,6.071384,6.071424,6.071424,6.071424,6.071424,6.07146,6.07146,6.07146,6.07146,6.07146,6.07146,6.07146,6.07146,6.071478,6.071478,6.071478,6.071478,6.071478,6.071353,6.071303,6.071303,6.071303,6.071303,6.071303,6.071303,6.071303,6.071303,6.071303,6.071303,6.071445,6.071445,6.071445,6.071445,6.071496,6.071496,6.071496,6.071496,6.071438,6.071438,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071433,6.071406,6.071445,6.071445,6.071445,6.071445,6.071464,6.071464,6.071464,6.071464,6.071464,6.071464,6.071464,6.071464,6.071464,6.071464,6.071464,6.071464,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071501,6.071425,6.071425,6.071405,6.071405,6.071405,6.07145,6.07145,6.07145,6.07145,6.07145,6.071383,6.071383,6.071383,6.071383,6.071383,6.071383,6.071413,6.071413,6.071413,6.071413,6.071439,6.071439,6.071439,6.071439,6.071439,6.071439,6.071439,6.071439,6.071439,6.071439,6.071439,6.071439,6.071383,6.071383,6.071383,6.071383,6.071383,6.071383,6.071383,6.071383,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491,6.071491};
        Double l2Long[] = {80.236092,80.236092,80.236092,80.236092,80.235992,80.235992,80.235992,80.235992,80.235992,80.235992,80.235992,80.235992,80.235992,80.235992,80.235992,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236122,80.236122,80.236061,80.236061,80.236061,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236183,80.236183,80.236183,80.236183,80.236183,80.236038,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.235985,80.235947,80.235947,80.235947,80.235947,80.236084,80.236084,80.236084,80.236084,80.236084,80.236084,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236023,80.236191,80.236176,80.236176,80.236176,80.236176,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.23616,80.23616,80.23616,80.236153,80.236153,80.236153,80.236153,80.236153,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236145,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236183,80.236115,80.236115,80.236115,80.236115,80.236115,80.236115,80.236115,80.236115,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137,80.236137};

        Double l3Lat[] = {6.07179,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.07183,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071675,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071556,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071595,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071559,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071723,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.071787,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.07165,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,6.071562,};
        Double l3Long[] = {80.236115,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236122,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.236328,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.23642,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236443,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236198,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236176,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236252,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,80.236412,};

        Double l4Lat[] = {6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072443,6.072439,6.072439,6.072439,6.072439,6.072439,6.072439,6.072439,6.072439,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072461,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072465,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.072546,6.07244,6.07244,6.07244,6.07244,6.07244,6.07244,6.07244,6.07244,6.07244,6.072712,6.072712,6.072469,6.072469,6.072469,6.072469,6.072469,6.072469,6.072469,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072451,6.072712,6.072548,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072563,6.072712,6.072515,6.072515,6.072515,6.072515,6.072515,6.072515,6.072515,6.072515,6.072515,6.072515,6.072515,};
        Double l4Long[] = {80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236046,80.236015,80.236015,80.236015,80.236015,80.236015,80.236015,80.236015,80.236015,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236038,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236107,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236061,80.236488,80.236488,80.236099,80.236099,80.236099,80.236099,80.236099,80.236099,80.236099,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236168,80.236488,80.236023,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236008,80.236488,80.236069,80.236069,80.236069,80.236069,80.236069,80.236069,80.236069,80.236069,80.236069,80.236069,80.236069,};

        List<LatLng> l2LatLng = new ArrayList<>();
        List<LatLng> l3LatLng = new ArrayList<>();
        List<LatLng> l4LatLng = new ArrayList<>();

        for(int i=0;i<l2Lat.length;i++){
            LatLng a = new LatLng(l2Lat[i],l2Long[i]);
            if(!l2LatLng.contains(a)){
                l2LatLng.add(a);
            }
        }
        for(int i=0;i<l3Lat.length;i++){
            LatLng a = new LatLng(l3Lat[i],l3Long[i]);
            if(!l3LatLng.contains(a)){
                l3LatLng.add(a);
            }
        }
        for(int i=0;i<l4Lat.length;i++){
            LatLng a = new LatLng(l4Lat[i],l4Long[i]);
            if(!l4LatLng.contains(a)){
                l4LatLng.add(a);
            }
        }

        String requestId = "cLMLQWONVmUNv1SHvMeW";
        FirebaseFirestore db = FirebaseFirestore.getInstance();
        FirebaseAuth mAuth = FirebaseAuth.getInstance();
        String uId = mAuth.getInstance().getUid();

        Log.d("size==", String.valueOf(l2LatLng.size()));
        Log.d("size==", String.valueOf(l3LatLng.size()));
        Log.d("size==", String.valueOf(l4LatLng.size()));

        for(int i=0;i<l2LatLng.size();i++){

            System.out.println("inserting="+i);
            Map<String, Object> data = new HashMap<>();
            data.put("requestId", requestId);
            data.put("latitude", l2LatLng.get(i).latitude);
            data.put("longitude", l2LatLng.get(i).longitude);
            data.put("level", 2);
            data.put("officerId", uId);
            data.put("timestamp",System.currentTimeMillis());

            db.collection("FieldData")
                    .add(data);
        }
        for(int i=0;i<l3LatLng.size();i++){

            System.out.println("inserting="+i);
            Map<String, Object> data = new HashMap<>();
            data.put("requestId", requestId);
            data.put("latitude", l3LatLng.get(i).latitude);
            data.put("longitude", l3LatLng.get(i).longitude);
            data.put("level", 3);
            data.put("officerId", uId);
            data.put("timestamp",System.currentTimeMillis());

            db.collection("FieldData")
                    .add(data);
        }
        for(int i=0;i<l4LatLng.size();i++){

            System.out.println("inserting="+i);
            Map<String, Object> data = new HashMap<>();
            data.put("requestId", requestId);
            data.put("latitude", l4LatLng.get(i).latitude);
            data.put("longitude", l4LatLng.get(i).longitude);
            data.put("level", 4);
            data.put("officerId", uId);
            data.put("timestamp",System.currentTimeMillis());

            db.collection("FieldData")
                    .add(data);
        }

    }
}