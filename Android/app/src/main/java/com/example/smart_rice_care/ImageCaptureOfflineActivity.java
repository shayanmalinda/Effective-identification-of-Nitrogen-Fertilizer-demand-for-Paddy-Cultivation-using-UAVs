package com.example.smart_rice_care;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.graphics.Matrix;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.media.ExifInterface;
import android.media.MediaPlayer;
import android.os.Build;
import android.os.Bundle;
import android.os.Environment;
import android.os.Handler;
import android.preference.PreferenceManager;
import android.util.Log;
import android.util.Rational;
import android.util.Size;
import android.view.Surface;
import android.view.TextureView;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.FrameLayout;
import android.widget.ImageButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.annotation.RequiresApi;
import androidx.appcompat.app.AppCompatActivity;
import androidx.camera.core.CameraX;
import androidx.camera.core.ImageCapture;
import androidx.camera.core.ImageCaptureConfig;
import androidx.camera.core.Preview;
import androidx.camera.core.PreviewConfig;
import androidx.core.app.ActivityCompat;
import androidx.core.content.ContextCompat;

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.FirebaseFirestore;
import com.loopj.android.http.RequestParams;
import com.loopj.android.http.SyncHttpClient;
import com.loopj.android.http.TextHttpResponseHandler;

import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import cz.msebera.android.httpclient.Header;

public class ImageCaptureOfflineActivity extends AppCompatActivity implements SensorEventListener, LocationListener {

    private int REQUEST_CODE_PERMISSIONS = 101;
    private String[] REQUIRED_PERMISSSIONS = new String[]{"android.permission.CAMERA", "android.permission.WRITE_EXTERNAL_STORAGE"};
    String folderName;
    Integer delayTime;
    TextureView txvCamera;
    Button btStop;
    TextView tvColorLevel, tvLongitude, tvLatitude;
    ImageButton btCaptureImage;
    FrameLayout frameLayout;
    ArrayList<Long> fileNames = new ArrayList<>();

    private SensorManager sensorMan;
    private Sensor accelerometer;
    private boolean sensorRegistered;

    private float[] mGravity;
    private double mAccel;
    private double mAccelCurrent;
    private double mAccelLast;

    private int hitCount = 0;
    private double hitSum = 0;
    private double hitResult = 0;

    private final int SAMPLE_SIZE = 5; // change this sample size as you want, higher is more precise but slow measure.
    private double THRESHOLD = 0; // change this threshold as you want, higher is more spike movement

    ImageCaptureConfig imageCaptureConfig;
    ImageCapture imgCap;

    MediaPlayer shutterSound;
    MediaPlayer music;
    MediaPlayer success;
    MediaPlayer error;

    private boolean captured = false;
    private boolean cameraWaiting = true;
    private boolean responseWaiting = false;

    private FusedLocationProviderClient fusedLocationClient;
    protected LocationManager locationManager;
    protected LocationListener locationListener;

    protected String latitude, longitude;
    protected boolean gps_enabled, network_enabled;

    Location currentLocation;

    @RequiresApi(api = Build.VERSION_CODES.N)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_image_capture);

        music = MediaPlayer.create(ImageCaptureOfflineActivity.this, R.raw.music);
        success = MediaPlayer.create(ImageCaptureOfflineActivity.this, R.raw.success);
        error = MediaPlayer.create(ImageCaptureOfflineActivity.this, R.raw.error);
        music.start();

        Intent getIntent = getIntent();
        folderName = getIntent.getStringExtra("folderName");
        delayTime = getIntent.getIntExtra("delayTime", 0);

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            System.out.println("testing=== requesting permission");
            ActivityCompat.requestPermissions(ImageCaptureOfflineActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},225);
            return;
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, ImageCaptureOfflineActivity.this);

        shutterSound = MediaPlayer.create(ImageCaptureOfflineActivity.this, R.raw.shutter);

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String threshold = preferences.getString("SENSORTHRESHOLD", "");
        if (!threshold.equalsIgnoreCase("")) {
            THRESHOLD = Double.parseDouble(threshold);
        }

        sensorMan = (SensorManager) this.getSystemService(ImageCaptureOfflineActivity.this.SENSOR_SERVICE);
        accelerometer = sensorMan.getDefaultSensor(Sensor.TYPE_ACCELEROMETER);
        mAccel = 0.00f;
        mAccelCurrent = SensorManager.GRAVITY_EARTH;
        mAccelLast = SensorManager.GRAVITY_EARTH;
        sensorMan.registerListener(this, accelerometer,
                SensorManager.SENSOR_DELAY_NORMAL);
        sensorRegistered = true;

        getSupportActionBar().hide();
        frameLayout = findViewById(R.id.frameLayout);
        txvCamera = (TextureView) findViewById(R.id.txvCamera);
        btCaptureImage = findViewById(R.id.btCaptureImage);
        tvColorLevel = findViewById(R.id.tvColorLevel);
        tvLongitude = findViewById(R.id.tvLongitude);
        tvLatitude = findViewById(R.id.tvLatitude);
        btStop = findViewById(R.id.btStop);

        btStop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent intent = new Intent(ImageCaptureOfflineActivity.this, DeleteImageActivity.class);
                intent.putExtra("fileNames", fileNames);
                intent.putExtra("folderName", folderName);
                intent.putExtra("approach", "online");
                intent.setFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                startActivity(intent);
                finish();
            }
        });

        tvColorLevel.setText("Delaying...");

        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            public void run() {
                tvColorLevel.setText("Ready...");
                music.stop();
                cameraWaiting = false;
            }
        }, delayTime*1000);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);

        if (allPermissionGranted()) {
            startCamera();
        } else {
            ActivityCompat.requestPermissions(this, REQUIRED_PERMISSSIONS, REQUEST_CODE_PERMISSIONS);
        }
    }

    private void startCamera() {
        CameraX.unbindAll();
        Rational aspectRatio = new Rational(txvCamera.getWidth(), txvCamera.getHeight());
        Size screen = new Size(txvCamera.getWidth(), txvCamera.getHeight());

        PreviewConfig pConfig = new PreviewConfig.Builder().setTargetAspectRatio(aspectRatio).setTargetResolution(screen).build();
        Preview preview = new Preview(pConfig);

        preview.setOnPreviewOutputUpdateListener(
                new Preview.OnPreviewOutputUpdateListener() {
                    @Override
                    public void onUpdated(Preview.PreviewOutput output) {
                        ViewGroup parent = (ViewGroup) txvCamera.getParent();
                        parent.removeView(txvCamera);
                        parent.addView(txvCamera);

                        txvCamera.setSurfaceTexture(output.getSurfaceTexture());
                        updateTransform();
                    }
                }
        );

        imageCaptureConfig = new ImageCaptureConfig.Builder().setCaptureMode(ImageCapture.CaptureMode.MAX_QUALITY)
                .setTargetRotation(getWindowManager().getDefaultDisplay().getRotation()).build();
        imgCap = new ImageCapture(imageCaptureConfig);

        btCaptureImage.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                captureImage(imgCap);
            }
        });

        CameraX.bindToLifecycle(this, preview, imgCap);
    }

    private File captureImage(ImageCapture imgCap) {
        shutterSound.start();
        responseWaiting = true;
        long currentTimestamp = System.currentTimeMillis();
        String filePath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() + "/" + folderName + "/" + currentTimestamp + ".jpg";
        File file = new File(filePath);
        imgCap.takePicture(file, new ImageCapture.OnImageSavedListener() {
            @RequiresApi(api = Build.VERSION_CODES.Q)
            @Override
            public void onImageSaved(@NonNull @NotNull File file) {
                fileNames.add(currentTimestamp);
                tvColorLevel.setText("Saving...");
                ExifInterface exif = null;
                try {
                    exif = new ExifInterface(filePath);
                } catch (IOException e) {
                    e.printStackTrace();
                }
                exif.setAttribute(ExifInterface.TAG_GPS_LATITUDE, GPS.convert(currentLocation.getLatitude()));
                exif.setAttribute(ExifInterface.TAG_GPS_LONGITUDE,  GPS.convert(currentLocation.getLongitude()));
                try {
                    exif.saveAttributes();
                    String msg = "Pic captured at " + file.getAbsolutePath();
                    success.start();
                    Handler handler = new Handler();
                    handler.postDelayed(new Runnable() {
                        public void run() {
                            tvColorLevel.setText("Ready...");
                            responseWaiting = false;
                        }
                    }, 2000);
                    Toast.makeText(ImageCaptureOfflineActivity.this, msg, Toast.LENGTH_SHORT).show();
                } catch (IOException e) {
                    e.printStackTrace();
                }
            }

            @Override
            public void onError(@NonNull @NotNull ImageCapture.UseCaseError useCaseError, @NonNull @NotNull String message, @Nullable @org.jetbrains.annotations.Nullable Throwable cause) {

                String msg = "Pic capture failed " + message;
                Log.e("Pic capture failed", message);
                Log.e("Pic capture failed", useCaseError.toString());
                Log.e("Pic capture failed", cause.toString());
                Toast.makeText(getBaseContext(), msg, Toast.LENGTH_LONG).show();

                if(cause != null) {
                    cause.printStackTrace();
                }
            }
        });
        return file;
    }

    private void updateTransform() {
        Matrix mx = new Matrix();
        float w = txvCamera.getMeasuredWidth();
        float h = txvCamera.getMeasuredHeight();

        float cx = w/2f;
        float cy = h/2f;

        int rotationDgr;
        int rotation = (int) txvCamera.getRotation();

        switch(rotation){
            case Surface.ROTATION_0:
                rotationDgr = 0;
                break;
            case Surface.ROTATION_90:
                rotationDgr = 90;
                break;
            case Surface.ROTATION_180:
                rotationDgr = 180;
                break;
            case Surface.ROTATION_270:
                rotationDgr = 270;
                break;
            default:
                return;
        }

        mx.postRotate((float)rotationDgr, cx, cy);
        txvCamera.setTransform(mx);
    }

    private boolean allPermissionGranted() {
        for (String permission: REQUIRED_PERMISSSIONS) {
            if(ContextCompat.checkSelfPermission(this, permission) != PackageManager.PERMISSION_GRANTED) {
                ActivityCompat.requestPermissions(this, REQUIRED_PERMISSSIONS,50);
                return false;
            }
        }
        return true;
    }

    @Override
    public void onSensorChanged(SensorEvent event) {
        if (event.sensor.getType() == Sensor.TYPE_ACCELEROMETER) {
            mGravity = event.values.clone();
            // Shake detection
            double x = mGravity[0];
            double y = mGravity[1];
            double z = mGravity[2];
            mAccelLast = mAccelCurrent;
            mAccelCurrent = Math.sqrt(x * x + y * y + z * z);
            double delta = mAccelCurrent - mAccelLast;
            mAccel = mAccel * 0.9f + delta;

            if (hitCount <= SAMPLE_SIZE) {
                hitCount++;
                hitSum += Math.abs(mAccel);
            } else {
                hitResult = hitSum / SAMPLE_SIZE;

                if (hitResult > THRESHOLD) {
//                    Moving
                    captured = false;
                }

                if(hitResult <= THRESHOLD && !captured && !cameraWaiting && !responseWaiting){
                    tvColorLevel.setText("Capturing...");
                    captured = true;
                    cameraWaiting = true;
                    captureImage(imgCap);

                    Handler handler = new Handler();
                    handler.postDelayed(new Runnable() {
                        public void run() {
                            cameraWaiting = false;
                        }
                    }, 3000);
                }

                hitCount = 0;
                hitSum = 0;
                hitResult = 0;
            }
        }
    }

    @Override
    public void onAccuracyChanged(Sensor sensor, int accuracy) {

    }

    @Override
    protected void onPause() {
        super.onPause();
    }

    @Override
    public void onLocationChanged(@NonNull Location location) {
        currentLocation = location;
        tvLatitude.setText("Latitude: "+location.getLatitude());
        tvLongitude.setText("Longitude: "+location.getLongitude());
    }
}