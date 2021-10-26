from flask import Flask, Response, request, jsonify
from io import BytesIO
import base64
from flask_cors import CORS, cross_origin
import os
import sys
from urllib.request import urlopen
import json
import cv2
import  numpy as np
import pandas as pd
from PIL import Image
from PIL.ExifTags import TAGS

app = Flask(__name__)
cors = CORS(app)

IMG_WIDTH=300
IMG_HEIGHT=400

@app.route("/image", methods=['POST','GET'])
def image():
    img = request.form.get("imagebytes", "Something went wrong!")#request.form["imagebytes"]
    print("######",img)
    decoded = json.loads(img)
    img2 = decoded.get("imagebytes")
    print("!!!!!!",img2)
    image111 = cv2.imread(img2)
    print("%%%%%%",image111)
    return img;


@app.route("/process", methods=['GET'])
def process():
    #pre-process
    file="IMG_20210721_100346.jpg";
    image=cv2.imread(file)
    cv2.imshow('img',image)
    rgbImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    hsvImage = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    low_green = np.array([30, 50, 76])
    high_green = np.array([80, 255, 255])
    mask = cv2.inRange(hsvImage, low_green, high_green)
    res = cv2.bitwise_and(rgbImage,rgbImage, mask= mask)

    image1=cv2.resize(res, (IMG_HEIGHT, IMG_WIDTH),interpolation = cv2.INTER_AREA)
    image1=np.array(image1)
    img_data=image1

    #extract metadata
    df = pd.DataFrame(columns=['image', 'brightness','shutter_speed','exposure_time'])
    img = Image.open(file)
    exifdata = img.getexif()
    img_mdata=np.zeros(3)
    # iterating over all EXIF data fields
    for tag_id in exifdata:
        # get the tag name, instead of human unreadable tag id
        tag = TAGS.get(tag_id, tag_id)
        data = exifdata.get(tag_id)

        # decode bytes
        if isinstance(data, bytes):
            data = data.decode()
        print(f"{tag:25}: {data}")
        if(tag=='BrightnessValue'): #string brightness value not found
            img_mdata[0]=data[0]/data[1]
            print("@@@@@@@",img_mdata[0])

        if(tag=='ShutterSpeedValue'):
            img_mdata[1]=data[0]/data[1]

        if(tag=='ExposureTime'):
            img_mdata[2]=data[0]/data[1]

    df.loc[0] = [file] + [img_mdata[0]] + [img_mdata[1]] + [img_mdata[2]]

    return str(df)





#if __name__ == '__main__':
app.run(host="0.0.0.0", port=5000, debug=True)