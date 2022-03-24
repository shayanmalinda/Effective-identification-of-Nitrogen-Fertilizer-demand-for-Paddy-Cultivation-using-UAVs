### Input to the /dtprocessfire [POST] url should be formatted as following key-value pairs :

#### image => the image that is captured to get the color level
#### field_data => the json file containing the following data format :
        {
            "longitude":0.565656,
            "latitude":4.125,
            "officerId":"o123",
            "requestId":"r123",
            "timestamp":16452300
            }
            
### The response along with the color level is sent to the database and the color level is sent back to the Android or Web client

