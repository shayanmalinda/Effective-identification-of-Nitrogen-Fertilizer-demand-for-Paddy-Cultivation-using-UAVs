from flask import Flask,request
from io import BytesIO
from flask_cors import CORS
import os
import json
import cv2
import  numpy as np
import pandas as pd
import piexif
import joblib
from PIL import Image
import io
import firebase_admin
from firebase_admin import credentials, firestore, initialize_app

cred = credentials.Certificate("../smart-rice-care-firebase-adminsdk.json")
firestore_app = initialize_app(cred)
db = firestore.client()
result_ref = db.collection('TestingFieldData')

app = Flask(__name__)
cors = CORS(app)

IMG_WIDTH=300
IMG_HEIGHT=400

@app.route("/",methods=['GET'])
def connect():
    return str("Connection Success!");

@app.route("/svcprocess", methods=['POST'])
def svcprocess():
    #capture the image from request
    img = request.files["image"].read()
    #preprocess & predict from saved image
    preprocessed_image=preprocess(img);
    arr_rgb=rgb_mean(preprocessed_image);
    df_metadata=extract_metadata(img);
    df = pd.DataFrame(columns=['red_val','green_val','blue_val'])
    df.loc[0] =[arr_rgb[0]] + [arr_rgb[1]] + [arr_rgb[2]]
    print("RGB : ",str(df))
    df['shutter_speed']=df_metadata['shutter_speed']
    df['exposure_time']=df_metadata['exposure_time']
    result=predictSVC(df);
    return str(result[0]);

@app.route("/dtprocess", methods=['POST'])
def dtprocess():
    #capture the image from request
    img = request.files["image"].read()
    #preprocess & predict from saved image
    preprocessed_image=preprocess(img);
    arr_rgb=rgb_mean(preprocessed_image);
    df_metadata=extract_metadata(img);
    df = pd.DataFrame(columns=['red_val','green_val','blue_val'])
    df.loc[0] =[arr_rgb[0]] + [arr_rgb[1]] + [arr_rgb[2]]
    df['shutter_speed']=df_metadata['shutter_speed']
    df['exposure_time']=df_metadata['exposure_time']
     
    print(str(df))
    result=predictDTree(df);
    return str(result[0]);


@app.route("/dtprocessfire", methods=['POST'])
def dtprocessfire():
    #capture the image from request
    img = request.files["image"].read()
    #preprocess & predict from saved image
    preprocessed_image=preprocess(img);
    arr_rgb=rgb_mean(preprocessed_image);
    df_metadata=extract_metadata(img);
    df = pd.DataFrame(columns=['red_val','green_val','blue_val'])
    df.loc[0] =[arr_rgb[0]] + [arr_rgb[1]] + [arr_rgb[2]]
    df['shutter_speed']=df_metadata['shutter_speed']
    df['exposure_time']=df_metadata['exposure_time']
     
    print(str(df))
    result=predictDTree(df);
    write_response=writeToServer(result[0])
    if (write_response=="success"):
        return str(result[0]);
    else:    
        return str(-1);

@app.route("/svcprocessfire", methods=['POST'])
def svcprocessfire():
    #capture the image from request
    img = request.files["image"].read()
    #preprocess & predict from saved image
    preprocessed_image=preprocess(img);
    arr_rgb=rgb_mean(preprocessed_image);
    df_metadata=extract_metadata(img);
    df = pd.DataFrame(columns=['red_val','green_val','blue_val'])
    df.loc[0] =[arr_rgb[0]] + [arr_rgb[1]] + [arr_rgb[2]]
    print("RGB : ",str(df))
    df['shutter_speed']=df_metadata['shutter_speed']
    df['exposure_time']=df_metadata['exposure_time']
    result=predictSVC(df);
    write_response=writeToServer(result[0])
    print("Response from Firestore : ",write_response);
    if (write_response=="success"):
        return str(result[0]);
    else:    
        return str(-1);

def writeToServer(computed_level):
    try:
        field_data_json=request.files["field_data"].read()
        field_data = json.loads(field_data_json)
        request_id=field_data["requestId"]
        doc_ref = result_ref.document(request_id)
        field_data['level']=int(computed_level)
        doc_ref.set(field_data)
        return "success"
    except Exception as e:
        return "error while writing to server"

def predictSVC(df):
    print("predict")
    # Load the model from the file
    model_svc = joblib.load('./svcmodel.pkl')
    
    # Use the loaded model to make predictions
    prd=model_svc.predict(df)
    return prd;

def predictDTree(df):
    print("predict")
    # Load the model from the file
    model_dt = joblib.load('./dtreemodel.pkl')
    
    # Use the loaded model to make predictions
    prd=model_dt.predict(df)
    return prd;

def preprocess(image):
    image = np.asarray(bytearray(image), dtype="uint8")
    image=cv2.imdecode(image,cv2.IMREAD_COLOR)
    
    rgbImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    hsvImage = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    low_green = np.array([30, 50, 76])
    high_green = np.array([80, 255, 255])
    mask = cv2.inRange(hsvImage, low_green, high_green)
    res = cv2.bitwise_and(rgbImage,rgbImage, mask= mask)

    image1=cv2.resize(res, (IMG_HEIGHT, IMG_WIDTH),interpolation = cv2.INTER_AREA)
    image1=np.array(image1)
    return image1;

def rgb_mean(image):
    rowcnt=image.shape[0]
    colcnt=image.shape[1]

    rgb_array=np.zeros((3))

    r=0
    b=0
    g=0
    nonzerocnt=0;
    for k in range(rowcnt):
        for l in range(colcnt):
            if not(image[k][l][0]==0 and image[k][l][1]==0 and image[k][l][2]==0):
                nonzerocnt+=1
                r+=image[k][l][0];
                g+=image[k][l][1];
                b+=image[k][l][2];#we dont remove images..just removing pixels..so rgbarr size no need to change
    if(nonzerocnt>0):
        rgb_array[0]=r/nonzerocnt;
        rgb_array[1]=g/nonzerocnt;
        rgb_array[2]=b/nonzerocnt;

    return  rgb_array;

def extract_metadata(image):
    #pre-process

    exif_dict = piexif.load(image)
    df = pd.DataFrame(columns=['brightness','shutter_speed','exposure_time'])
    img_mdata=np.zeros(3)

    for tag in exif_dict['Exif']:
        tag_name = piexif.TAGS['Exif'][tag]["name"]
        tag_value = exif_dict['Exif'][tag]
        # Avoid print a large value, just to be pretty
        if isinstance(tag_value, bytes):
            tag_value = tag_value[:10]
        
        if(tag_name=='BrightnessValue'): #string brightness value not found
            img_mdata[0]=tag_value[0]/tag_value[1]

        if(tag_name=='ShutterSpeedValue'):
            img_mdata[1]=tag_value[0]/tag_value[1]

        if(tag_name=='ExposureTime'):
            img_mdata[2]=tag_value[0]/tag_value[1]

    df.loc[0] =[img_mdata[0]] + [img_mdata[1]] + [img_mdata[2]]
    print("Metadata",str(df))
    return df



#if __name__ == '__main__':
app.run(host="0.0.0.0", port=5000, debug=True)
