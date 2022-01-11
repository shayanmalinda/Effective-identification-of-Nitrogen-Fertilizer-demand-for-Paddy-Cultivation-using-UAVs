package com.example.smart_rice_care;

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

import com.google.android.gms.location.FusedLocationProviderClient;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.firestore.DocumentReference;
import com.google.firebase.firestore.DocumentSnapshot;
import com.google.firebase.firestore.FirebaseFirestore;
import com.google.firebase.firestore.QueryDocumentSnapshot;
import com.google.firebase.firestore.QuerySnapshot;
import com.loopj.android.http.RequestParams;
import com.loopj.android.http.SyncHttpClient;
import com.loopj.android.http.TextHttpResponseHandler;

import org.jetbrains.annotations.NotNull;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;

import cz.msebera.android.httpclient.Header;

public class ImageCaptureActivity extends AppCompatActivity implements SensorEventListener, LocationListener {

    private int REQUEST_CODE_PERMISSIONS = 101;
    private String[] REQUIRED_PERMISSSIONS = new String[]{"android.permission.CAMERA", "android.permission.WRITE_EXTERNAL_STORAGE"};
    private String requestId, fieldId, farmerId;
    private Integer delayTime;
    private TextureView txvCamera;
    private TextView tvColorLevel, tvLongitude, tvLatitude;
    private ImageButton btCaptureImage;
    private FrameLayout frameLayout;
    private Button btStop;


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

        music = MediaPlayer.create(ImageCaptureActivity.this, R.raw.music);
        success = MediaPlayer.create(ImageCaptureActivity.this, R.raw.success);
        error = MediaPlayer.create(ImageCaptureActivity.this, R.raw.error);
        music.start();


        Intent getIntent = getIntent();
        requestId = getIntent.getStringExtra("requestId");
        fieldId = getIntent.getStringExtra("fieldId");
        farmerId = getIntent.getStringExtra("farmerId");
        delayTime = getIntent.getIntExtra("delayTime", 0);

        locationManager = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        if (ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_FINE_LOCATION) != PackageManager.PERMISSION_GRANTED && ActivityCompat.checkSelfPermission(this, Manifest.permission.ACCESS_COARSE_LOCATION) != PackageManager.PERMISSION_GRANTED) {
            System.out.println("testing=== requesting permission");
            ActivityCompat.requestPermissions(ImageCaptureActivity.this, new String[]{Manifest.permission.ACCESS_FINE_LOCATION, Manifest.permission.ACCESS_COARSE_LOCATION},225);
            return;
        }
        locationManager.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, ImageCaptureActivity.this);


        shutterSound = MediaPlayer.create(ImageCaptureActivity.this, R.raw.shutter);

        SharedPreferences preferences = PreferenceManager.getDefaultSharedPreferences(this);
        String threshold = preferences.getString("SENSORTHRESHOLD", "");
        if (!threshold.equalsIgnoreCase("")) {
            THRESHOLD = Double.parseDouble(threshold);
        }

        sensorMan = (SensorManager) this.getSystemService(ImageCaptureActivity.this.SENSOR_SERVICE);
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

        tvColorLevel.setText("Delaying...");

        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            public void run() {
                tvColorLevel.setText("Starting...");
                music.stop();
                cameraWaiting = false;
            }
        }, delayTime*1000);

        fusedLocationClient = LocationServices.getFusedLocationProviderClient(this);
//        frameLayout.addView(btCaptureImage);


        if (allPermissionGranted()) {
            startCamera();
        } else {
            ActivityCompat.requestPermissions(this, REQUIRED_PERMISSSIONS, REQUEST_CODE_PERMISSIONS);
        }

        btStop = findViewById(R.id.btStop);
        btStop.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                updateCurrentFertilizerAmount();
            }
        });
    }

    private void updateCurrentFertilizerAmount() {
        FirebaseFirestore db = FirebaseFirestore.getInstance();

        DocumentReference docRef = db.collection("FieldRequests").document(requestId);
        docRef.get().addOnCompleteListener(new OnCompleteListener<DocumentSnapshot>() {
            @Override
            public void onComplete(@NonNull @NotNull Task<DocumentSnapshot> task) {
                if (task.isSuccessful()) {
                    DocumentSnapshot document = task.getResult();
                    if (document.exists()) {
                        String division = document.get("division").toString();
                        Long plantAge = (Long) document.get("plantAge");
                        db.collection("LCCDetails")
                                .whereEqualTo("division", division)
                                .get()
                                .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                    @Override
                                    public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task2) {
                                        if(task2.isSuccessful()){
                                            if(task2.getResult().size()==0){
                                                // Get general LCC details, if specific data not available
                                                db.collection("LCCDetails")
                                                        .whereEqualTo("division", "ALL")
                                                        .get()
                                                        .addOnCompleteListener(new OnCompleteListener<QuerySnapshot>() {
                                                            @Override
                                                            public void onComplete(@NonNull @NotNull Task<QuerySnapshot> task3) {
                                                                if(task3.isSuccessful()){
                                                                    Long fertilizer2=0L, fertilizer3=0L, fertilizer4=0L;
                                                                    for (QueryDocumentSnapshot document : task3.getResult()) {
                                                                        ArrayList<HashMap> data = (ArrayList<HashMap>) document.get("weekDetails");
                                                                        HashMap<String, Long> weekData = data.get(plantAge.intValue()-1);
                                                                        fertilizer2 = weekData.get("levelOne");
                                                                        fertilizer3 = weekData.get("levelTwo");
                                                                        fertilizer4 = weekData.get("levelThree");
                                                                    }

                                                                    Map<String, Object> fertilizerAmount = new HashMap<>();
                                                                    fertilizerAmount.put("requestId", requestId);
                                                                    fertilizerAmount.put("level2", fertilizer2);
                                                                    fertilizerAmount.put("level3", fertilizer3);
                                                                    fertilizerAmount.put("level4", fertilizer4);
                                                                    db.collection("Fertilizer")
                                                                            .document(requestId)
                                                                            .set(fertilizerAmount)
                                                                            .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                                                @Override
                                                                                public void onSuccess(Void unused) {
                                                                                    Toast.makeText(ImageCaptureActivity.this, "Stopped", Toast.LENGTH_SHORT).show();

                                                                                    FirebaseFirestore db = FirebaseFirestore.getInstance();
                                                                                    DocumentReference docRef = db.collection("FieldRequests").document(requestId);
                                                                                    docRef.update("status", "completed")
                                                                                            .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                                                                @Override
                                                                                                public void onSuccess(Void unused) {
                                                                                                    Log.d("Status Update: ", "DocumentSnapshot successfully updated!");
                                                                                                }
                                                                                            })
                                                                                            .addOnFailureListener(new OnFailureListener() {
                                                                                                @Override
                                                                                                public void onFailure(@NonNull @NotNull Exception e) {
                                                                                                    Log.w("Status Update: ", "Error updating document", e);
                                                                                                }
                                                                                            });

                                                                                    finish();
                                                                                }
                                                                            })
                                                                            .addOnFailureListener(new OnFailureListener() {
                                                                                @Override
                                                                                public void onFailure(@NonNull @NotNull Exception e) {
                                                                                    Toast.makeText(ImageCaptureActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                                                                                }
                                                                            });
                                                                }

                                                                else{
                                                                    Log.d("LCCDetails error:", task3.getException().toString());
                                                                    Toast.makeText(ImageCaptureActivity.this, ""+task3.getException(), Toast.LENGTH_SHORT).show();
                                                                }
                                                            }
                                                        });
                                            }
                                            else{
//                                                 Get specific LCC details
                                                Long fertilizer2=0L, fertilizer3=0L, fertilizer4=0L;
                                                for (QueryDocumentSnapshot document : task2.getResult()) {
                                                    ArrayList<HashMap> data = (ArrayList<HashMap>) document.get("weekDetails");
                                                    HashMap<String, Long> weekData = data.get(plantAge.intValue()-1);
                                                    fertilizer2 = weekData.get("levelOne");
                                                    fertilizer3 = weekData.get("levelTwo");
                                                    fertilizer4 = weekData.get("levelThree");
                                                }

                                                Map<String, Object> fertilizerAmount = new HashMap<>();
                                                fertilizerAmount.put("requestId", requestId);
                                                fertilizerAmount.put("level2", fertilizer2);
                                                fertilizerAmount.put("level3", fertilizer3);
                                                fertilizerAmount.put("level4", fertilizer4);
                                                db.collection("Fertilizer")
                                                        .document(requestId)
                                                        .set(fertilizerAmount)
                                                        .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                            @Override
                                                            public void onSuccess(Void unused) {
                                                                Toast.makeText(ImageCaptureActivity.this, "Stopped", Toast.LENGTH_SHORT).show();

                                                                FirebaseFirestore db = FirebaseFirestore.getInstance();
                                                                DocumentReference docRef = db.collection("FieldRequests").document(requestId);
                                                                docRef.update("status", "completed")
                                                                        .addOnSuccessListener(new OnSuccessListener<Void>() {
                                                                            @Override
                                                                            public void onSuccess(Void unused) {
                                                                                Log.d("Status Update: ", "DocumentSnapshot successfully updated!");
                                                                            }
                                                                        })
                                                                        .addOnFailureListener(new OnFailureListener() {
                                                                            @Override
                                                                            public void onFailure(@NonNull @NotNull Exception e) {
                                                                                Log.w("Status Update: ", "Error updating document", e);
                                                                            }
                                                                        });

                                                                finish();

                                                            }
                                                        })
                                                        .addOnFailureListener(new OnFailureListener() {
                                                            @Override
                                                            public void onFailure(@NonNull @NotNull Exception e) {
                                                                Toast.makeText(ImageCaptureActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                                                            }
                                                        });
                                            }
                                        }
                                        else{
                                            Log.d("LCCDetails error:", task.getException().toString());
                                            Toast.makeText(ImageCaptureActivity.this, ""+task.getException(), Toast.LENGTH_SHORT).show();
                                        }
                                    }
                                });
                    } else {
                        Log.d("FieldRequests fetch: ", "No such document");
                    }
                } else {
                    Log.d("FieldRequests fetch: ", "get failed with ", task.getException());
                }
            }
        });
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
        File dir = new File(Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() + "/" + requestId);
        try {
            if (dir.mkdir()) {
                Log.d("Directory creation", "Directory created");
            } else {
                Log.d("Directory creation", "Directory creation failed");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        String filePath = Environment.getExternalStoragePublicDirectory(Environment.DIRECTORY_DCIM).getAbsolutePath() + "/" + requestId + "/" + System.currentTimeMillis() + ".jpg";
        File file = new File(filePath);
        imgCap.takePicture(file, new ImageCapture.OnImageSavedListener() {
            @RequiresApi(api = Build.VERSION_CODES.Q)
            @Override
            public void onImageSaved(@NonNull @NotNull File file) {

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
                    processImage(file, currentLocation);
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

    public void processImage(File file, Location location) throws IOException {
        tvColorLevel.setText("Processing...");
        String url = "http://192.168.8.103:5000/process";

        Thread thread = new Thread(new Runnable() {

            @Override
            public void run() {

                SyncHttpClient client = new SyncHttpClient();
                RequestParams params = new RequestParams();
                try {
                    params.put("image", new File(file.getAbsolutePath()));
                } catch (FileNotFoundException e) {
                    e.printStackTrace();
                }

                client.post(url, params, new TextHttpResponseHandler() {
                    @Override
                    public void onFailure(int statusCode, Header[] headers, String responseString, Throwable throwable) {
                        if(!responseString.equals(null)){
                            System.out.println("Response===Failed "+ responseString);
                            Log.d("Response===Failed ", responseString);
                            Toast.makeText(ImageCaptureActivity.this, responseString, Toast.LENGTH_SHORT).show();
                        }
                        error.start();
                    }

                    @Override
                    public void onSuccess(int statusCode, Header[] headers, String responseString) {
                        String level = responseString;
                        System.out.println("Response===Success =  "+ level);
                        Log.d("Response===Success ", responseString);
                        tvColorLevel.setText("Level "+level);

                        FirebaseAuth mAuth = FirebaseAuth.getInstance();
                        FirebaseFirestore db = FirebaseFirestore.getInstance();
                        String uId = mAuth.getInstance().getUid();

                        Map<String, Object> data = new HashMap<>();
                        data.put("requestId", requestId);
                        data.put("latitude", location.getLatitude());
                        data.put("longitude", location.getLongitude());
                        data.put("officerId", uId);
                        data.put("level", Integer.parseInt(level));

                        db.collection("FieldData")
                                .add(data)
                                .addOnSuccessListener(new OnSuccessListener<DocumentReference>() {
                                    @Override
                                    public void onSuccess(DocumentReference documentReference) {
                                        success.start();
                                        Handler handler = new Handler();
                                        handler.postDelayed(new Runnable() {
                                            public void run() {
                                                responseWaiting = false;
                                            }
                                        }, 2000);
                                        Toast.makeText(ImageCaptureActivity.this, "ALL SUCCESS", Toast.LENGTH_SHORT).show();
                                    }
                                })
                                .addOnFailureListener(new OnFailureListener() {
                                    @Override
                                    public void onFailure(@NonNull @NotNull Exception e) {
                                        responseWaiting = false;
                                        Toast.makeText(ImageCaptureActivity.this, e.getMessage(), Toast.LENGTH_SHORT).show();
                                        error.start();
                                    }
                                });

                    }
                });

            }
        });


        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            public void run() {
                thread.start();
            }
        }, 500);
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