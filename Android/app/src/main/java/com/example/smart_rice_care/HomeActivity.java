package com.example.smart_rice_care;

import static org.opencv.imgcodecs.Imgcodecs.IMREAD_UNCHANGED;
import static org.opencv.imgcodecs.Imgcodecs.imdecode;

import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.graphics.Matrix;
import android.media.Image;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.FileUtils;
import android.util.Base64;
import android.widget.Button;
import android.view.View;
import android.widget.ImageView;
import android.widget.Toast;

import com.google.android.gms.common.util.IOUtils;

import java.io.BufferedInputStream;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileDescriptor;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import org.opencv.android.OpenCVLoader;
import org.opencv.android.Utils;
import org.opencv.core.CvType;
import org.opencv.core.Mat;
import org.opencv.core.MatOfByte;
import org.opencv.imgcodecs.Imgcodecs;
import org.opencv.imgproc.Imgproc;

public class HomeActivity extends AppCompatActivity {

    Button btn_signin,btn_signup,btn_map,btn_myrequests,btn_capture;
    ImageView imageView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_home);
        btn_signin = findViewById(R.id.button_signin);
        btn_signup = findViewById(R.id.button_signup);
        btn_map = findViewById(R.id.button_map);
        btn_myrequests = findViewById(R.id.button_myrequests);
        btn_capture=findViewById(R.id.button_capture);
        imageView = findViewById(R.id.imageView1);

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

        String filepath = "IMG_20210721_100346.jpg";
        btn_capture.setOnClickListener(
                v -> {

                }
        );

    }
}