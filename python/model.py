from tkinter.tix import Tree
from keras.models import load_model
from PIL import Image, ImageOps
import numpy as np
import requests
import sys
import json

import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'  # or any {'0', '1', '2'}
def warn(*args, **kwargs):
    pass

import warnings
warnings.filterwarnings('ignore', category = DeprecationWarning)
warnings.filterwarnings('ignore', category = FutureWarning)

def predictOut(h5Model,lblTxtFile):
    # Load the model
    # model = load_model('python/models/mineral_type_keras_model.h5')
    model = load_model(h5Model)

    # Create the array of the right shape to feed into the keras model
    # The 'length' or number of images you can put into the array is
    # determined by the first position in the shape tuple, in this case 1.
    data = np.ndarray(shape=(1, 224, 224, 3), dtype=np.float32)
    # Replace this with the path to your image
    # url='https://ucarecdn.com/7b77d38a-069a-44e5-a97a-8bfafdd4cf66/1665293010794IMG_20220508_133943.jpg'
    image = Image.open(requests.get(sys.argv[1], stream=True).raw).convert('RGB')

    # image = Image.open('<IMAGE_PATH>').convert('RGB')
    #resize the image to a 224x224 with the same strategy as in TM2:
    #resizing the image to be at least 224x224 and then cropping from the center

    size = (224, 224)
    image = ImageOps.fit(image, size, Image.ANTIALIAS)

    #turn the image into a numpy array
    image_array = np.asarray(image)
    # Normalize the image
    normalized_image_array = (image_array.astype(np.float32) / 127.0) - 1
    # Load the image into the array
    data[0] = normalized_image_array

    # run the inference
    prediction = model.predict(data)
    index = np.argmax(prediction)
    # class_name = mineral_type_labels[index]
    # confidence_score = prediction[0][index]

    # with open('python/models/mineral_type_labels.txt', 'r') as fp:
    with open(lblTxtFile, 'r') as fp:
        x = fp.readlines()[index]
        return(str(x.strip()))

def getRRD(makingTechnique):
  if makingTechnique.strip()=="Blade Technique":
      return("Mesolithic")
  elif makingTechnique.strip()=="Indirect Percussion Technique":
      return("Lower Paleolithic")
  elif makingTechnique.strip()=="Grinding and Polishing Technique":
      return("Neolithic")
  elif makingTechnique.strip()=="Direct Percussion Technique":
      return("Lower Paleolithic")
  else:
  	return("Can't get Rough Relative Date")

def predict():
    if int(predictOut('python/models/artifact_keras_model.h5','python/models/artifact_labels.txt'))==1:
        # json_data='{"source_link":"'+sys.argv[1]+'","stone_details":{"isArtifact":true,"mineralType": "'+predictOut('python/models/mineral_type_keras_model.h5','python/models/mineral_type_labels.txt')+'","makingTechnique":"'+predictOut('python/models/making_tech_keras_model.h5','python/models/making_tech_labels.txt')+'","functionalDescription":"'+predictOut('python/models/functional_value_keras_model.h5','python/models/functional_value_labels.txt')+'"}}'
        json_data={
                    "source_link":sys.argv[1],
                    "stone_details": {
                        "isArtifact":True,
                        "mineralType":predictOut('python/models/mineral_type_keras_model.h5','python/models/mineral_type_labels.txt'),
                        "makingTechnique":predictOut('python/models/making_tech_keras_model.h5','python/models/making_tech_labels.txt'),
                        "roughRelativeDating":getRRD(predictOut('python/models/making_tech_keras_model.h5','python/models/making_tech_labels.txt')),
                        "functionalDescription":predictOut('python/models/functional_value_keras_model.h5','python/models/functional_value_labels.txt')
                        }
                    }
        # formated_json=json_data.strip()
        # json_object = json.loads(json_data)
        json_formatted_str = json.dumps(json_data)
        return(json_formatted_str)
    else:
        return('{"stone_details":{"isArtifact":false}','}')

# call predict function
print(predict())