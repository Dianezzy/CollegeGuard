#! /usr/local/bin/python3
# coding: utf-8

import os

#爬虫参数设置

# 渔网点坐标所在文件
xy_name = "data.txt"

#需要爬取的区域的四个方向点坐标
city_bound_point_A = [120.073689,30.31569]#[120.123896,30.275811]#[114.286652,30.642638] #左上角点，x619
city_bound_point_D = [120.073689,30.21569]#[120.123069,30.264769]#[114.239273,30.580588] #左下角点，农场十一队
city_bound_point_B = [120.173689,30.31569]#[120.135034,30.275281]#[114.462433,30.574677] #右上角点，木妙
city_bound_point_C = [120.173689,30.21569]#[120.1341,30.264239]#[114.418488,30.479746] #右下角点，牛场右下角

#当前目录用"."表示，如"./example/"
filepath = r"./data/"
if not os.path.exists(filepath):
	os.makedirs(filepath)
filename = "data"

captcha_path = './captcha/'

#爬取的间隔时间
sleeptime = 3600 #单位是秒，7200秒即为2小时
#每个qq号抓取的次数
fre = 80

#每次爬取方格的边长（单位：km）
edge = 1 #2.6

#下面的参数不用设置
lng_delta = 0.01167*edge
lat_delta = 0.009*edge
#是否手动识别验证码，如需手动识别验证码，设置为True，否则设置为False，遇到验证码直接跳过
CAPTCHA_RECOGNIZ = True#False