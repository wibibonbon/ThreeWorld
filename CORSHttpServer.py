import socket
import json
import glob
import sys
from http.server import HTTPServer, SimpleHTTPRequestHandler, test

from os import listdir
from os.path import isfile, join

class CORSRequestHandler (SimpleHTTPRequestHandler):
    def end_headers (self):
        self.send_header('Access-Control-Allow-Origin', '*')
        SimpleHTTPRequestHandler.end_headers(self)

test(CORSRequestHandler, HTTPServer, port=8080)

serverSocket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)

host = '127.0.0.1'
port = 8080

buffer_size = 4096

serverSocket.bind((host, port))
serverSocket.listen(10)

print("Listening on %s:%s..." % (host, str(port)))

data=''
main_path = 'src\\db\\bps\\'

for f in listdir(main_path):
    with open(main_path+f) as json_file:
        data_tmp = json.load(json_file)
        data_tmp = json.dumps(data_tmp)
        data += data_tmp

data = data.encode()

while True:



    clientSocket, address = serverSocket.accept()
    print("Connection received from %s..." % str(address))
    print(data)
    clientSocket.send(data)
    #clientSocket.send(bytes("test",'utf-8'))
    clientSocket.close()