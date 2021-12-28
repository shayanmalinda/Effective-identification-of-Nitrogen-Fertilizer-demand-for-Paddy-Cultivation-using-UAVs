import sys
import json
import requests

#res = requests.post("http://192.168.1.3:5000/image",data="hello")
res= requests.post("http://192.168.1.3:5000/image", data=dict(imagebytes='bar'))
print (res.text)