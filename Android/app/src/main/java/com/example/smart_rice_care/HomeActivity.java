package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;

public class HomeActivity extends AppCompatActivity {

    Button btn_signin,btn_signup,btn_map;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        btn_signin=findViewById(R.id.button_signin);
        btn_signup=findViewById(R.id.button_signup);
        btn_map=findViewById(R.id.button_map);

        btn_signup.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this,RegisterActivity.class);
                    startActivity(i);
                }
        );

        btn_map.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this,MapsActivity.class);
                    startActivity(i);
                }
        );
    }
}