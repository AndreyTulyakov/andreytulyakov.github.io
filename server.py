from flask import Flask
from flask import render_template
import glob
import json

app = Flask(__name__, template_folder='.', static_folder='', static_url_path='')

@app.route('/')
def index():
    return render_template('index.html')

if __name__ == '__main__':
    app.debug = True
    app.run()
    # app.run(host='0.0.0.0')


