package com.example.smart_rice_care;

import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.util.Base64;

import org.json.JSONException;
import org.json.JSONObject;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;

import okhttp3.Call;
import okhttp3.Callback;
import okhttp3.FormBody;
import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.RequestBody;
import okhttp3.Response;

public class UploadImageActivity extends AppCompatActivity {

    String filepath = "IMG_20210721_100346.jpg";
    InputStream inputStream=null;
    byte[] bytes;
    byte[] buffer = new byte[8192];
    int bytesRead;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_upload_image);
        try {
            inputStream=getResources().getAssets().open(filepath);

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

            RequestBody formBody=new FormBody.Builder().add("imagebytes", String.valueOf(jsonObject)).build();//jsonObject.toString()
           


            Request request=new Request.Builder().url("http://192.168.1.3:5000/image").post(formBody).build();
            client.newCall(request).enqueue(new Callback() {
                @Override
                public void onFailure(@NonNull Call call, @NonNull IOException e) {
                    // Toast.makeText(HomeActivity.this,"failed !!!",Toast.LENGTH_LONG);
                }

                @Override
                public void onResponse(@NonNull Call call, @NonNull Response response) throws IOException {
                    //Toast.makeText(HomeActivity.this,"Success--!",Toast.LENGTH_LONG);
                    //btn_capture.setText(response.body().string());
                }
            });

        } catch (IOException | JSONException e) {
            e.printStackTrace();
        }
    }
}