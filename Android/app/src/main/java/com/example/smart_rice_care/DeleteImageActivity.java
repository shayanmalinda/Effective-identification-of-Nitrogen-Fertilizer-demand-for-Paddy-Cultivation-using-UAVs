package com.example.smart_rice_care;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.Bundle;
import android.os.Environment;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import java.io.File;
import java.sql.Timestamp;
import java.util.ArrayList;

public class DeleteImageActivity extends AppCompatActivity {

    ArrayList<Long> fileNames = new ArrayList<>();
    TextView tvImageCount;
    Integer currentIndex;
    ImageView ivImage, ivNext, ivBack;
    Button btDelete, btFinish;
    String folderName;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_delete_image);

        Intent getIntent = getIntent();
        fileNames =  (ArrayList<Long>)  getIntent.getSerializableExtra("fileNames");
        folderName =  getIntent.getStringExtra("folderName");
        ivImage = findViewById(R.id.ivImage);
        ivNext = findViewById(R.id.ivNext);
        ivBack = findViewById(R.id.ivBack);
        btDelete = findViewById(R.id.btDelete);
        btFinish = findViewById(R.id.btFinish);
        tvImageCount = findViewById(R.id.tvImageCount);
        currentIndex = fileNames.size()-1;

        showImage();

        ivBack.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(currentIndex>0){
                    currentIndex--;
                    showImage();
                }
            }
        });

        ivNext.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(currentIndex<fileNames.size()){
                    currentIndex++;
                    showImage();
                }
            }
        });

        btDelete.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                if(fileNames.size()>1){
                    File imgFile = new  File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() +
                            "/" + folderName + "/" + fileNames.get(currentIndex)+".jpg");
                    if (imgFile.exists()) {
                        if (imgFile.delete()) {
                            System.out.println("testing==="+fileNames.size());
                            fileNames.remove(fileNames.get(currentIndex));
                            if(currentIndex>0){
                                currentIndex--;
                            }
                            Toast.makeText(DeleteImageActivity.this, "Deleted", Toast.LENGTH_SHORT).show();
                            System.out.println("testing==="+fileNames.size());
                            showImage();
                        } else {
                            Toast.makeText(DeleteImageActivity.this, "Unable to delete the file", Toast.LENGTH_SHORT).show();
                        }
                    }
                }
                else{
                    Toast.makeText(DeleteImageActivity.this, "You can not delete all the images", Toast.LENGTH_SHORT).show();
                }
            }
        });

        btFinish.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                finish();
            }
        });


    }

    private void showImage() {

        Integer labelIndex = currentIndex+1;

        tvImageCount.setText("Image "+ labelIndex +" of " + fileNames.size());

        ivNext.setVisibility(View.VISIBLE);
        ivBack.setVisibility(View.VISIBLE);

        if(currentIndex==0){
            ivBack.setVisibility(View.GONE);
        }

        if(currentIndex==fileNames.size()-1){
            ivNext.setVisibility(View.GONE);
        }

        if (fileNames.size()>currentIndex){

            File imgFile = new  File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() +
                    "/" + folderName + "/" + fileNames.get(currentIndex)+".jpg");
            if(imgFile.exists()){
                Bitmap myBitmap = BitmapFactory.decodeFile(imgFile.getAbsolutePath());
                ivImage.setImageBitmap(myBitmap);
                ivImage.setRotation(90);
            };
        }

    }
}