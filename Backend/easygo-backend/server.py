from flask import Flask
# from generate_data import *
from flask import request
from main import easygospider

app = Flask(__name__)
spider = easygospider()
# spider = None

@app.route('/')
def index():
    return 'Index Page'

@app.route('/data')
def get_heatmap_data():
    # return {"data": "monument"}
    lat = float(request.args.get('lat', 0))
    lng = float(request.args.get('lng', 0))
    print('lat:',lat, 'lng:', lng)

    if lat==0 and lng==0:
        return {"error"}

    radius = 1; # km
    left_top = [lng - 0.01 * radius, lat + 0.01 * radius] # 左上
    right_top = [lng + 0.01 * radius, lat + 0.01 * radius] # 右上
    left_down = [lng - 0.01 * radius, lat - 0.01 * radius] # 左下
    right_down = [lng + 0.01 * radius, lat - 0.01 * radius] # 右下

    # filename = str(lat) + '_'+str(lng) + '_'
    filename = str(format(lat, '.2f'))+ '_' + str(format(lng, '.2f')) + '_'
    print(filename, left_top,right_top,left_down,right_down)
    
    return spider.get_population_data(filename, left_top, right_top, left_down, right_down)

if __name__ == "__main__":
    # spider = easygospider()
    app.run(host='0.0.0.0',port='5000',debug=True)
    