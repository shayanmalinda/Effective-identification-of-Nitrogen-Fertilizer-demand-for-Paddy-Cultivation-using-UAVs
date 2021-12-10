package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.Toast;

import com.google.firebase.auth.FirebaseAuth;

public class AgriculturalOfficerHomeActivity extends AppCompatActivity {

    Button btViewRequests, btSignout;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_agricultural_officer_home);

        btViewRequests = findViewById(R.id.btViewRequests);
        btSignout = findViewById(R.id.btSignout);

        btViewRequests.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(AgriculturalOfficerHomeActivity.this, ViewRequests.class);
                startActivity(intent);
            }
        });

        btSignout.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                FirebaseAuth.getInstance().signOut();
                Intent intent = new Intent(AgriculturalOfficerHomeActivity.this, SignInActivity.class);
                Toast.makeText(AgriculturalOfficerHomeActivity.this, "Signout Success", Toast.LENGTH_SHORT).show();
                startActivity(intent);
            }
        });
    }
}