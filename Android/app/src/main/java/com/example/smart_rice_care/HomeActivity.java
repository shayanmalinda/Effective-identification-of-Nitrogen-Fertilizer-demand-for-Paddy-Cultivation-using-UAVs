package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;

import android.os.Bundle;
import android.widget.Button;


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
                    Intent i = new Intent(HomeActivity.this, MyRequestsActivity.class);
                    startActivity(i);
                }
        );

        btn_capture.setOnClickListener(
                v -> {
                    Intent i=new Intent(HomeActivity.this,UploadImageActivity.class);
                    startActivity(i);
                }
        );
    }
}