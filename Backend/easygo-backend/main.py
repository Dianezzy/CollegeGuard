# coding: utf-8

#加载内置包
import requests
import json
import time
import sys
import csv
import json
import os
import random
#加载第三方包
import pandas
from selenium import webdriver
from requests.exceptions import RequestException
from selenium.common.exceptions import WebDriverException
import cv2
from PIL import Image as Im
from selenium.webdriver import ActionChains
import numpy as np
from selenium.webdriver.chrome.options import Options
#加载自己编写的文件
import qqlist
import settings
import transCoordinateSystem
from get_grid import create_yichuxing_data

SYSTEM = 1 # 0: WINDOWS 1: LINUX

chrome_options = Options()
#chrome_options.add_argument('--no-sandbox')
#chrome_options.add_argument('--disable-dev-shm-usage')
#chrome_options.add_argument('--headless')
chrome_options.add_argument("enable-automation")
chrome_options.add_argument("--headless")
chrome_options.add_argument("--window-size=1920,1080")
chrome_options.add_argument("--no-sandbox")
chrome_options.add_argument("--disable-extensions")
chrome_options.add_argument("--dns-prefetch-disable")
chrome_options.add_argument("--disable-gpu")
#chrome_options.setPageLoadStrategy(PageLoadStrategy.NORMAL);

class CookieException(Exception):
    def __init__(self):
        Exception.__init__(self)

class easygospider():
    #初始化基本量
    def __init__(self):
        self.qq_number_list = []
        self.cookie = None
        #输入文件的名称
        self.input = settings.xy_name
        #文件保存的路径
        self.filepath = settings.filepath
        self.filename = settings.filename
        self.qq_number_list = qqlist.qq_list
        self.captcha_path = settings.captcha_path

        # self.cookie = self.get_cookie()
        self.init_existed_files()

    def init_existed_files(self):
        self.existed_files = []
        for dir in os.listdir(self.filepath):
            filePath = os.path.join(self.filepath, dir)  # 得到文件夹和文件的完整路径
            if os.path.isdir(filePath):
               self.existed_files.append(dir)
        print(self.existed_files)

    # 初始化用于爬虫的网格，形成url
    def initial_paramslist(self):
        """
        :return: List[]
        """
        create_yichuxing_data()

        #filename文件中需要存储的为Wgs84坐标系下渔网为2.5Km的中心点的坐标，格式如data.txt
        #读取渔网中心点
        center = []
        with open(self.input, 'r', encoding='utf-8') as f:
            for item in f.readlines()[1:]:
                center.append(tuple(item.strip().split(",")[-2:]))
        #生成四至范围（按照2.6km范围生成，防止有遗漏点，如有重复，最后去重的时候处理）
        round = []
        for item in center:
            lng, lat = item
            lng, lat = float(lng), float(lat)
            round.append([lng - 0.5 * settings.lng_delta,
                          lng + 0.5 * settings.lng_delta,
                          lat - 0.5 * settings.lat_delta,
                          lat + 0.5 * settings.lat_delta])
        #生成待抓取的params
        paramslist = []
        for item in round:
            lng_min, lng_max, lat_min, lat_max = item
            #lng_min, lat_min = transCoordinateSystem.wgs84_to_gcj02(lng_min, lat_min)
            #lng_max, lat_max = transCoordinateSystem.wgs84_to_gcj02(lng_max, lat_max)
            params = {"lng_min": lng_min,
                      "lat_max": lat_max,
                      "lng_max": lng_max,
                      "lat_min": lat_min,
                      "level": 16,
                      "city": "杭州",
                      "lat": "undefined",
                      "lng": "undefined",
                      "_token": ""}
            paramslist.append(params)
        return paramslist

    def get_distance(self, small_url, big_url):
        """
        :param small_url: 是小图的路径(本地)
        :param big_url: 是大图的路径(本地)
        :return: 计算出移动的距离
        """
        # 引用上面的图片下载
        otemp = self.pic_download(small_url, 'small')
        time.sleep(2)
        # 引用上面的图片下载
        oblk = self.pic_download(big_url, 'big')
        # 计算拼图还原距离
        target = cv2.imread(otemp, 0)
        template = cv2.imread(oblk, 0)
        w, h = target.shape[::-1]
        temp = self.captcha_path + 'temp.jpg'
        targ = self.captcha_path + 'targ.jpg'
        cv2.imwrite(temp, template)
        cv2.imwrite(targ, target)
        target = cv2.imread(targ)
        target = cv2.cvtColor(target, cv2.COLOR_BGR2GRAY)
        target = abs(255 - target)
        cv2.imwrite(targ, target)
        target = cv2.imread(targ)
        template = cv2.imread(temp)
        result = cv2.matchTemplate(target, template, cv2.TM_CCOEFF_NORMED)
        x, y = np.unravel_index(result.argmax(), result.shape)
        # 缺口位置
        print((y, x, y + w, x + h))
        # 调用PIL Image 做测试
        image = Im.open(oblk)
        xy = (y + 20, x + 20, y + w - 20, x + h - 20)
        # 切割
        imagecrop = image.crop(xy)
        # 保存切割的缺口
        imagecrop.save(self.captcha_path + "new_image.jpg")
        return y

    def pic_download(self, url, pic_type):
        """
        :param url:  是图片的链接
        :param pic_type: 区分左侧小拼图和大图,大图传big,小图传small
        :return: 图片下载到本地,返回图片保存路径
        """
        path = self.captcha_path + pic_type + '.png'
        try:
            if not os.path.exists(self.captcha_path):
                os.makedirs(self.captcha_path)
            if os.path.exists(path):
                os.remove(path)
            r = requests.get(url)
            r.raise_for_status()
            with open(path, "wb") as f:  # 开始写文件，wb代表写二进制文件
                f.write(r.content)
                # print(f.name)
            print("{}图片下载完成".format(pic_type))
            return f.name

        except Exception as e:
            print("获取失败!" + str(e))
            self.pic_download(url, pic_type)

    def remove_captcha_old(self, driver):
        # 切换最初的frame中
        # driver.switch_to.default_content()
        # 切换frame
        # driver.switch_to.frame('login_frame')
        # 切换带有刷新按钮的frame
        driver.switch_to.frame(driver.find_element_by_xpath('//*[@id="newVcodeIframe"]/iframe'))

        # 点击刷新 id为e_reload
        driver.find_element_by_id('e_reload').click()
        # 获取图片链接
        big_url = driver.find_element_by_id('slideBg').get_attribute('src')
        small_url = driver.find_element_by_id('slideBlock').get_attribute('src')
        # 下载图片并计算拼图还原的距离
        y = self.get_distance(small_url, big_url)
        # 获取当前网页链接，用于判断拖动验证码后是否成功,如果拖动后地址没变则为失败
        slide_before_url = driver.current_url
        # 获取蓝色拖动按钮对象
        element = driver.find_element_by_id('tcaptcha_drag_button')
        # 计算distance（记住要用浮点型数字，不然计算后会取整）
        distance = y * (280.0 / 680.0) - 31
        print('distance:', distance)

        write_log(driver.page_source)
        for i in range(3):
            # 模拟人为拖动按钮
            has_gone_dist = 0
            remaining_dist = distance
            # remaining_dist += random.randint(-5, 5)
            # 按下鼠标左键
            ActionChains(driver).click_and_hold(element).perform()
            time.sleep(0.5)
            while remaining_dist > 0:
                ratio = remaining_dist / distance
                if ratio < 0.2:
                    # 开始阶段移动较慢
                    span = random.randint(5, 8)
                elif ratio > 0.8:
                    # 结束阶段移动较慢
                    span = random.randint(6, 8)
                else:
                    # 中间部分移动快
                    span = random.randint(10, 16)

                if span > remaining_dist: 
                    span = remaining_dist
                ActionChains(driver).move_by_offset(span, random.randint(-2,2)).perform()
                remaining_dist -= span
                has_gone_dist += span
                print(remaining_dist, span)
                time.sleep(random.randint(5, 20) / 100)

            # print(remaining_dist+span)
            # ActionChains(driver).move_by_offset(remaining_dist, random.randint(-2,2)).perform()
            # time.sleep(random.randint(5, 20) / 100)
            ActionChains(driver).release(on_element=element).perform()
            time.sleep(1.0)

            try:
                # alert = driver.find_element_by_class_name('tcaptcha-title').text
                text = driver.find_element_by_id('guideText').text
                print(text)
                if text == '拖动下方滑块完成拼图':
                    break
                else:
                    distance += 5#random.randint(-5,5)
                # break
            except Exception as e:
                # print('滑块验证失败',e)
                distance += 5
                continue
            # if "拖动下方滑块完成拼图" in driver.page_source:
            #     break
            # else:
            #     print('滑块验证失败')
            #     distance += 5

        time.sleep(5)

    def remove_captcha(self, driver):
        # 切换带有刷新按钮的frame
        driver.switch_to.frame(driver.find_element_by_xpath('//*[@id="newVcodeIframe"]/iframe'))

        # 点击刷新 id为e_reload
        driver.find_element_by_id('e_reload').click()
        # 获取当前网页链接，用于判断拖动验证码后是否成功,如果拖动后地址没变则为失败
        slide_before_url = driver.current_url
        # 获取蓝色拖动按钮对象
        element = driver.find_element_by_id('tcaptcha_drag_button')

        distance = 170
        print('distance:', distance)

        write_log(driver.page_source)
        for i in range(3):
            # 模拟人为拖动按钮
            has_gone_dist = 0
            remaining_dist = distance
            # remaining_dist += random.randint(-5, 5)
            # 按下鼠标左键
            ActionChains(driver).click_and_hold(element).perform()
            time.sleep(0.5)
            while remaining_dist > 0:
                ratio = remaining_dist / distance
                if ratio < 0.2:
                    # 开始阶段移动较慢
                    span = random.randint(5, 8)
                elif ratio > 0.8:
                    # 结束阶段移动较慢
                    span = random.randint(6, 8)
                else:
                    # 中间部分移动快
                    span = random.randint(10, 16)

                if span > remaining_dist: 
                    span = remaining_dist
                ActionChains(driver).move_by_offset(span, random.randint(-2,2)).perform()
                remaining_dist -= span
                has_gone_dist += span
                print(remaining_dist, span)
                time.sleep(random.randint(5, 20) / 100)

            # print(remaining_dist+span)
            # ActionChains(driver).move_by_offset(remaining_dist, random.randint(-2,2)).perform()
            # time.sleep(random.randint(5, 20) / 100)
            ActionChains(driver).release(on_element=element).perform()
            time.sleep(5.0)

            print(driver.current_url, slide_before_url)
            if driver.current_url == slide_before_url:
                distance -= random.randint(1,5)
            else:
                break
            # try:
                # # alert = driver.find_element_by_class_name('tcaptcha-title').text
                # text = driver.find_element_by_id('guideText').text
                # print(text)
                # if text == '拖动下方滑块完成拼图':
                #     break
                # else:
                #     distance -= 5#random.randint(-5,5)
                # break
            # except Exception as e:
            #     # print('滑块验证失败',e)
            #     distance -= 5
            #     continue
            # if "拖动下方滑块完成拼图" in driver.page_source:
            #     break
            # else:
            #     print('滑块验证失败')
            #     distance += 5

        # time.sleep(5)

    def get_cookie(self):
        for qq in self.qq_number_list:
            qq_num = qq[0]
            qq_passwd = qq[1]

            try:
                if SYSTEM == 0:
                    chrome_login = webdriver.Chrome(executable_path="chromedriver.exe",chrome_options=chrome_options)
                else:
                    chrome_login = webdriver.Chrome(executable_path="../chromedriver",chrome_options=chrome_options)
                # chrome_login.implicitly_wait(2)

                chrome_login.get("https://mail.qq.com/")
                print(1)
                time.sleep(1)
                # 切换frame login_frame是该登录窗口iframe的id
                chrome_login.switch_to.frame("login_frame")
                # 点击选择帐号密码登录
                # print(1.0)
                # print(chrome_login.page_source)
                # write_log(chrome_login.page_source)
                # chrome_login.get_screenshot_as_file("init.png")
                time.sleep(1)
                # chrome_login.execute_script("window.scrollTo(0, window.scrollY + 100)")
                # chrome_login.get_screenshot_as_file("full.png")
                # try:
                    # element = chrome_login.find_element_by_id("switcher_plogin")
                    # print(element, element.is_displayed(), element.is_enabled(), element.location)
                    # element.screenshot('./scr.png')
                # except WebDriverException as e:
                    # print('eee',e)
                # ActionChains(chrome_login).move_to_element(element).perform()
                # element.click()
                try:
                    chrome_login.find_element_by_id("switcher_plogin").click()
                except WebDriverException as e:
                    pass
                # time.sleep(1)
                # ActionChains(chrome_login).click(element).perform()
                # chrome_login.find_element_by_css_selector('#switcher_plogin').click()
                print(2)
                time.sleep(1)                
                chrome_login.find_element_by_id("u").send_keys(qq_num)
                chrome_login.find_element_by_id("p").send_keys(qq_passwd)
                time.sleep(0.5)
                chrome_login.find_element_by_id("login_button").click()
                # 检查是否存在验证码
                print(3)
                time.sleep(2)
                if "安全验证" in chrome_login.page_source:
                    time.sleep(1)
                    write_log(chrome_login.page_source)
                    chrome_login.get_screenshot_as_file("screenshot/"+str(time.time())+"_verify.png")
                    if settings.CAPTCHA_RECOGNIZ:
                        # input('等待手动去除验证码')
                        # time.sleep(10)
                        self.remove_captcha(chrome_login)
                        # time.sleep(2)
                    else:
                        chrome_login.close()
                        continue
                time.sleep(1)
                chrome_login.get_screenshot_as_file("screenshot/"+str(time.time())+".png")
                write_log("AFTER VERIFY "+chrome_login.page_source)
                if "登录验证" in chrome_login.page_source:
                    write_log("登录验证 "+chrome_login.page_source)
                    chrome_login.find_element_by_id("login_button").click() #发送验证码
                    code = input('短信验证码')
                    try:
                        num = int(code)
                        chrome_login.find_element_by_id("u").send_keys(code)
                        chrome_login.get_screenshot_as_file("screenshot/"+str(time.time())+"_code.png")
                    except Exception as e:
                        print(e)
                # 获取cookie
                print(4)
                time.sleep(1)
                cookies = chrome_login.get_cookies()
                # print(cookies)
                write_log(str(qq_num)+" get cookie successful")
                # write_log(str(cookies))
                print(5)
                time.sleep(1)
                chrome_login.quit()
                user_cookie = {}
                for cookie in cookies:
                    user_cookie[cookie["name"]] = cookie["value"]
                print(user_cookie)
                write_log(str(user_cookie))

                self.cookie = user_cookie
                break
            except WebDriverException as e:
                print('Exception:',e)
                pass
            finally:
                try:
                    print('close')
                    chrome_login.close()
                except Exception as e:
                    print('Exception', e)
                    pass

    def spider(self,cookie,params):
        user_header = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36",
            "Referer": "http://c.easygo.qq.com/eg_toc/map.html?origin=csfw"
        }
        url = "http://c.easygo.qq.com/api/egc/heatmapdata"
        # write_log(str(cookie))
        while True:
            try:
                r = requests.get(url, headers=user_header,
                                 cookies=cookie, params=params)
                # print(r.status_code)
                if r.status_code == 200 and r.text[2]!='c': # code=3:error
                    write_log(r.text)
                    return r.text
                else:
                    raise CookieException
            except RequestException:
                self.spider(cookie, params)

    def save(self,text,time_now,file_name):
        try:
            with open(file_name, 'r') as f:
                f.readline()
        except FileNotFoundError as e:
            with open(file_name, 'w', encoding='utf-8') as f:
                f.write('count,wgs_lng,wgs_lat,time\n')
        # 写入数据
        with open(file_name, "a", encoding="utf-8") as f:
            if text is None:
                return
            # print(text)
            node_list = json.loads(text)["data"]
            try:
                min_count = json.loads(text)['max_data']/40
                for i in node_list:
                    # 此处的算法在宜出行网页后台的js可以找到，文件路径是http://c.easygo.qq.com/eg_toc/js/map-55f0ea7694.bundle.js
                    i['count'] = i['count'] // min_count
                    gcj_lng = 1e-6 * (250.0 * i['grid_x'] + 125.0)
                    gcj_lat = 1e-6 * (250.0 * i['grid_y'] + 125.0)
                    lng, lat = transCoordinateSystem.gcj02_to_wgs84(gcj_lng, gcj_lat)
                    f.write(str(i['count']) + "," + str(lng) + "," + str(lat) + "," + time_now + "\n")
            except IndexError as e:
                pass
                # print("此区域没有点信息")
            except TypeError as e:
                # print(node_list)
                raise CookieException
    def remove_duplicate(self,filepath):
        # df = pandas.read_csv(filepath,sep=",")
        df = pandas.read_csv(filepath, sep=',')
        df = df.drop_duplicates()
        csv_name = filepath.replace(".txt", "去重结果.csv")
        df.to_csv(csv_name,index=False)

    def exec_once(self):
        # if self.cookie == None:
            # self.cookie = self.get_cookie()
        file_path = self.filepath + self.filename + '/' + self.filename

        while True:
            time_now = time.time()
            time_now_str = time.strftime('%Y-%m-%d-%H-%M-%S', time.localtime(time_now))
            write_log("此轮抓取开始")
            # cookie = self.get_cookie()
            i = 1
            params_list = self.initial_paramslist()
            for params in params_list:
                # print('params:',params)
                #这部分负责每个qq号码抓取的次数
                # if i % settings.fre == 0:
                    # cookie = self.get_cookie()
                while True:
                    try:
                        text = self.spider(self.cookie, params)
                        tmp_file_path = self.filepath + self.filename + '/'  + time_now_str
                        # self.save(text, time_now_str, file_name=self.filepath + self.filename + time_now_str + ".txt")
                        self.save(text, time_now_str, file_name=tmp_file_path + ".txt")
                        break
                    except CookieException as e:
                        self.get_cookie()

                view_bar(i, len(params_list))
                i += 1
            if os.path.exists(file_path + ".txt"):
                os.remove(file_path + ".txt")
            os.rename(tmp_file_path + ".txt", file_path + ".txt")

            if os.path.exists(tmp_file_path + ".txt"):
                os.remove(tmp_file_path + ".txt")

            write_log("写入json")
            # file_path = self.filepath + self.filename + time_now_str# + ".txt"
            csvfile = open(file_path+'.txt', 'r')
            jsonfile = open(file_path+'.json', 'w')
            reader = csv.DictReader(csvfile)
            out = json.dumps([row for row in reader])
            # print(out)
            jsonfile.write(out)

            # break
            return file_path

    def get_population_data(self, filename, left_top, right_top, left_down, right_down):
        # region config
        settings.city_bound_point_A = left_top
        settings.city_bound_point_B = right_top
        settings.city_bound_point_C = right_down
        settings.city_bound_point_D = left_down
        self.filename = settings.filename = filename
        self.input = settings.xy_name = settings.filepath + filename +'grid.txt'

        out_filepath = self.filepath + self.filename + '/' + self.filename
        out_dir = self.filepath + self.filename
        if not os.path.exists(out_dir):
            os.makedirs(out_dir) 
        if not os.path.exists(out_filepath+'.json'):
            if self.cookie == None:
                self.get_cookie()
            out_filepath = self.exec_once()

        data = []
        with open(out_filepath+'.json','r') as f:
            data = f.read()
        return data

def write_log(content):
    with open("log.log",'a',encoding='utf-8') as f:
        info = time.strftime("%Y-%m-%d %H:%M:%S ",time.localtime())+content+"\n"
        # sys.stdout.write(info)
        f.write(info)

def view_bar(num, total):
    rate = float(num) / float(total)
    rate_num = int(rate * 100)
    r = '\r[%s%s]%d%%' % ("="*(rate_num), " "*(100-rate_num), rate_num, )
    sys.stdout.write(r)

if __name__ == "__main__":
    app = easygospider()
    # app.exec()
    # app.get_cookie()