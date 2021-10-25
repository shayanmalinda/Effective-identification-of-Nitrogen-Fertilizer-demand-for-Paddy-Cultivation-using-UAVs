package com.example.smart_rice_care;

import static org.opencv.imgcodecs.Imgcodecs.IMREAD_UNCHANGED;
import static org.opencv.imgcodecs.Imgcodecs.imdecode;

import androidx.annotation.NonNull;
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
import com.squareup.okhttp.Headers;
import com.squareup.okhttp.MultipartBuilder;
import com.squareup.okhttp.ResponseBody;

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
import okhttp3.FormBody;
import okhttp3.MediaType;
import okhttp3.MultipartBody;
import okhttp3.MultipartReader;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

import org.json.JSONException;
import org.json.JSONObject;
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
        InputStream inputStream=null;
        try {
            inputStream=getResources().getAssets().open(filepath);

            byte[] bytes;
            byte[] buffer = new byte[8192];
            int bytesRead;
            ByteArrayOutputStream output = new ByteArrayOutputStream();

            File file = new File(getCacheDir(), "paddyimage.jpg");//
            OutputStream outputStream = new FileOutputStream(file);//
            try {
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    output.write(buffer, 0, bytesRead);
                    outputStream.write(buffer, 0, bytesRead);//
                }
                outputStream.flush();
            }
            catch (IOException e) {
                e.printStackTrace();
            }

            bytes = output.toByteArray();

            String encodedString = Base64.encodeToString(bytes, Base64.DEFAULT);
            JSONObject jsonObject=new JSONObject();
            jsonObject.put("imagebytes",file);
            //System.out.println("Outside : "+encodedString);
            inputStream.close();

            OkHttpClient client=new OkHttpClient().newBuilder().build();

            RequestBody formBody=new FormBody.Builder().add("imagebytes",jsonObject.toString()).build();//jsonObject.toString()
            //RequestBody formBody=new FormBody.Builder().add("imagebytes",RequestBody.create(file,MediaType.parse("image/jpeg"))).build();

           /* RequestBody formBody = new MultipartBody.Builder().setType(MultipartBody.FORM)
                    .addFormDataPart("imagebytes","imagebytes", RequestBody.create(file,MediaType.parse("image/jpeg"))).build();
*/


            Request request=new Request.Builder().url("http://192.168.1.3:5000/image").post(formBody).build();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                   // Toast.makeText(HomeActivity.this,"failed !!!",Toast.LENGTH_LONG);
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    //Toast.makeText(HomeActivity.this,"Success--!",Toast.LENGTH_LONG);
                    btn_capture.setText(response.body().string());
                }
            });
            btn_capture.setOnClickListener(
                    v -> {

                        //request

                    }
            );
        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
    }
}