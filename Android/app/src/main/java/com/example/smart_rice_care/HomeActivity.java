package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.view.View;
import android.widget.Toast;
import java.io.IOException;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class HomeActivity extends AppCompatActivity {

    Button btn_signin,btn_signup,btn_map,btn_myrequests, bt_capture_image;

    private String url = "http:///" + BuildConfig.FLASK_SERVER_URL + ":" + 5000 + "/";
    private String postBodyString;
    private MediaType mediaType;
    private RequestBody requestBody;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        setContentView(R.layout.activity_home);

        btn_signin=findViewById(R.id.button_signin);
        btn_signup=findViewById(R.id.button_signup);
        btn_map=findViewById(R.id.button_map);
        btn_myrequests=findViewById(R.id.button_myrequests);
        bt_capture_image=findViewById(R.id.bt_capture_image);

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
                    Intent i = new Intent(HomeActivity.this,MapsActivity.class);
                    startActivity(i);
                }
        );

        btn_myrequests.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this,MyRequestsActivity.class);
                    startActivity(i);
                }
        );

        bt_capture_image.setOnClickListener(
                v -> {
                    Intent i = new Intent(HomeActivity.this,ImageCaptureActivity.class);
                    startActivity(i);
                }
        );

        btn_signin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                postRequest("your message here", url);

            }
        });
    }


        private RequestBody buildRequestBody(String msg) {
            postBodyString = msg;
            mediaType = MediaType.parse("text/plain");
            requestBody = RequestBody.create(postBodyString, mediaType);
            return requestBody;
        }


        private void postRequest(String message, String URL) {
            RequestBody requestBody = buildRequestBody(message);
            OkHttpClient okHttpClient = new OkHttpClient();
            Request request = new Request
                    .Builder()
                    .post(requestBody)
                    .url(URL)
                    .build();
            okHttpClient.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(final Call call, final IOException e) {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {


                            Toast.makeText(HomeActivity.this, "Something went wrong:" + " " + e.getMessage(), Toast.LENGTH_SHORT).show();
                            call.cancel();


                        }
                    });

                }

                @Override
                public void onResponse(Call call, final Response response) throws IOException {
                    runOnUiThread(new Runnable() {
                        @Override
                        public void run() {
                            try {
                                Toast.makeText(HomeActivity.this, response.body().string(), Toast.LENGTH_LONG).show();
                            } catch (IOException e) {
                                e.printStackTrace();
                            }
                        }
                    });


                }
            });
        }

}