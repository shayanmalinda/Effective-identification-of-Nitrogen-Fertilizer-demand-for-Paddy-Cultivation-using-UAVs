package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.text.TextUtils;
import android.util.Log;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.Toast;

public class RegisterUserDetailsActivity extends AppCompatActivity {

    Button btNext;
    EditText etFirstName, etLastName, etEmail, etPhone, etNic, etPassword, etPasswordReEnter;
    String firstName, lastName, email, phone, nic, password, passwordReEnter;
    boolean allFieldsValidated;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_register_user_details);

        btNext = findViewById(R.id.btNext);

        etFirstName = findViewById(R.id.etFirstName);
        etLastName = findViewById(R.id.etLastName);
        etEmail = findViewById(R.id.etEmail);
        etPhone = findViewById(R.id.etPhone);
        etNic = findViewById(R.id.etNic);
        etPassword = findViewById(R.id.etPassword);
        etPasswordReEnter = findViewById(R.id.etPasswordReEnter);

        btNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {

                firstName = etFirstName.getText().toString();
                lastName = etLastName.getText().toString();
                email = etEmail.getText().toString();
                phone = etPhone.getText().toString();
                nic = etNic.getText().toString();
                password = etPassword.getText().toString();
                passwordReEnter = etPasswordReEnter.getText().toString();

                allFieldsValidated = validateAllFields();

//                if(allFieldsValidated){
                if(true){
                    Intent intent = new Intent(RegisterUserDetailsActivity.this, RegisterFieldDetailsActivity.class);
                    startActivity(intent);
                }
                else{
                    Toast.makeText(getApplicationContext(),  getResources().getString(R.string.please_check_the_form_again), Toast.LENGTH_LONG).show();
                }
            }
        });

    }

    private boolean validateAllFields() {
        String phonePattern = "^(?:0|94|\\+94|0094)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\\d)\\d{6}$";
        String nicPattern = "^([0-9]{9}[x|X|v|V]|[0-9]{12})$";

        boolean isAllFieldValid = true;
        if(etFirstName.length()==0){
            etFirstName.setError(getResources().getString(R.string.first_name_can_not_be_empty));
            isAllFieldValid = false;
        }
        if(etLastName.length()==0){
            etLastName.setError(getResources().getString(R.string.last_name_can_not_be_empty));
            isAllFieldValid = false;
        }
        if(!(etEmail.length()>0 && Patterns.EMAIL_ADDRESS.matcher(email).matches())){
            etEmail.setError(getResources().getString(R.string.invalid_email));
            isAllFieldValid = false;
        }
        if(etEmail.length()==0){
            etEmail.setError(getResources().getString(R.string.email_can_not_be_empty));
            isAllFieldValid = false;
        }
        if(!(etPhone.length()>0 && phone.trim().matches(phonePattern))){
            etPhone.setError(getResources().getString(R.string.invalid_phone_number));
            isAllFieldValid = false;
        }
        if(etPhone.length()==0){
            etPhone.setError(getResources().getString(R.string.phone_number_can_not_be_empty));
            isAllFieldValid = false;
        }
        if(!(nic.length()>0 && nic.trim().matches(nicPattern))){
            etNic.setError(getResources().getString(R.string.invalid_nic));
            isAllFieldValid = false;
        }
        if(etNic.length()==0){
            etNic.setError(getResources().getString(R.string.nic_can_not_be_empty));
            isAllFieldValid = false;
        }
        Log.d("password1", password);
        Log.d("password2", passwordReEnter);
        if(!password.equals(passwordReEnter)){
            etPasswordReEnter.setError(getResources().getString(R.string.password_mismatches));
            isAllFieldValid = false;
        }
        if(etPassword.length()<6){
            etPassword.setError(getResources().getString(R.string.password_should_have_at_least_6_characters));
            isAllFieldValid = false;
        }
        if(etPasswordReEnter.length()<6){
            etPasswordReEnter.setError(getResources().getString(R.string.password_should_have_at_least_6_characters));
            isAllFieldValid = false;
        }
        return isAllFieldValid;
    }
}