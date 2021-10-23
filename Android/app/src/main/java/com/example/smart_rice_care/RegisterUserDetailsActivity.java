package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;

public class RegisterUserDetailsActivity extends AppCompatActivity {

    EditText txt_fname,txtlname,txt_email,txt_password,txt_nic;
    Button btn_next;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_user_details);



//        btn_next=findViewById(R.id.buttonNext);
//        btn_next.setOnClickListener(
//                v -> {
//                    Intent i = new Intent(RegisterUserDetailsActivity.this, RegisterFieldDetailsActivity.class);
//                    startActivity(i);
//                }
//        );




    }
}