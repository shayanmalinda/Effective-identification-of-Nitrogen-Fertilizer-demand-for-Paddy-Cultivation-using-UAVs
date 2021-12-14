import flask
import numpy as np
import cv2
import os
import io
import PIL.Image as Image
from array import array
import requests
import shutil

path="/content/drive/My Drive/Final Year Research/Dataset/Oneplus 5T/Level 04/IMG_20210721_100324.jpg"

IMG_WIDTH=300
IMG_HEIGHT=400

app = flask.Flask(__name__)


@app.route('/', methods=['GET', 'POST'])
def handle_request():
    return "Successful Connection"

@app.route('/getname/<name>', methods=['GET','POST'])
def extract_name(name):
    return "she is "+name;

@app.route('/preprocess/<file>', methods=['GET','POST'])
def preprocess_image(file):
    r = requests.get(settings.STATICMAP_URL.format(**data), stream=True)
    if r.status_code == 200:
        with open(path, 'wb') as f:
            r.raw.decode_content = True
            shutil.copyfileobj(r.raw, f)

    image=cv2.imread(f)
    print(image)
    #rgbImage = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

    #hsvImage = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    #low_green = np.array([30, 50, 76])
    #high_green = np.array([80, 255, 255])
    #mask = cv2.inRange(hsvImage, low_green, high_green)
    #res = cv2.bitwise_and(rgbImage,rgbImage, mask= mask)

    #image1=cv2.resize(res, (IMG_HEIGHT, IMG_WIDTH),interpolation = cv2.INTER_AREA)
    #image1=np.array(image1)
    #image1 = image1.astype('float32')
    #image1 /= 255
    #img_data=image1
    #if(i==200):break
    return "abc";

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)
