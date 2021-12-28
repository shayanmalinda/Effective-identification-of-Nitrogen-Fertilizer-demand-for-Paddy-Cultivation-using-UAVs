# Effective-identification-of-Nitrogen-Fertilizer-demand-for-Paddy-Cultivation-using-UAVs

This work is intended to automate the manual process of identifying Nitrogen fertilizer demand for paddy cultivation using an image processing based Machine Learning approach

## The system provides following software deliverables :
    - A mobile application for the Aggricultural officers
    - A mobile application for the farmers
    - Web applications for the admin and aggricultural office


## Please go through the following steps to configure the web server

1. Go to your terminal and type the following command:

    $ pip3 install Flask
    
2. Install OpenCV,ScikitLearn and other python libraries used by the server.
3. Add the following line in build.gradle (app)
    implementation 'com.squareup.okhttp3:okhttp:4.5.0'
   
4. Add the following line in application tag of android manifest
   android:usesCleartextTraffic="true"
   
5. Add this line before the application tag in manifest
    <uses-permission android:name="android.permission.INTERNET" />
