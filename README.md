# Google-GH-College Safe Guard


## 环境配置

### 环境搭建
下载 npm，地址：https://nodejs.org/en/download/

#### 安装 expo
npm install --global expo-cli

#### 创建新项目
expo init proj_name
#### 模板选择 blank 空白模板即可
流程完毕后，进入 se-example 文件夹，并执行 npm start。

运行成功后，页面左下角会出现二维码，可以使用手机 expo 客户端扫码。手机 expo 客户端下载链接为 https://expo.io/tools#client。

在手机上运行 expo 客户端后，将手机于开发机连入同一局域网，扫描左下角的二维码即可运行 app。
#### 后端服务器
google cloud platform
centOS 7
Python 3.6.8
Selenium
Flask 1.1.2
Werkzeug 1.0.1

### 资源参考
1. react-native中的google地图库
https://www.npmjs.com/package/react-native-maps-google
2. 
前端：expo - react native 
docs for reactnative https://reactnative.cn/
https://expo.io/

后端：express - nodejs https://www.expressjs.com.cn/

UI: Ant Design Mobile of React https://rn.mobile.ant.design/index-cn


## 代码运行与说明
### 代码运行
1. 本地先建个空expo项目（假设为文件夹A）
2. `git clone https://github.com/Dianezzy/CollegeGuard.git`
3. 把clone后的代码复制到A中
4. 在A中执行`npm install`
5. 执行expo start, 在弹出的浏览器dev tool左下角可选LAN（需要同一网络）/Local（手机连usb）
### android环境说明
- 由于react-native高德地图模块不支持expo框架，因此我做了expo eject，eject的时候选择保留expoKit，android的配置及运行如下：
	- 安装android studio，配置相应android sdk
	- 执行`expo eject --eject-method expoKit`
	- 在android studio中执行项目构建（build）
	- 执行`expo start`
	- 在android studio中执行Run
### 代码说明
#### 文件夹说明：
- assets：存放字体、图像等资源
- components：一些UI组件
- constants：常量（颜色、宽高等）
- core： 
	- mapdata.js：web api获取高德地图路径规划数据
	- utils.js： 一些功能函数
- hooks：存放hooks（暂不用）
- **navigation**：导航器
	- HomeNavigator.js：包含首页、导航、购物、个人中心四个页面的导航
	- StartNavigator.js：app启动后的导航，包含登录注册等页面导航
- **screens**：页面
	- StartScreen.js：启动界面
	- LoginScreen.js：登录界面
	- RegisterScreen.js：注册界面
	- ForgotPasswordScreen.js：重置密码界面
	- HomeScreen.js：首页界面
	- FindrouteScreen.js: 路径导航界面
	- ShopScreen.js：购物界面
	- PersonalCenterScreen.js：个人中心界面
- purchase：
- purchase_M：
#### 逻辑说明：
- HomeScreen界面对用户进行定位并显示周边地图及区域人流密度（热力图），同时每隔一段时间调用接口刷新热力图
- FindrouteScreen接收用户输入（出发地及目的地），转为经纬度后调用mapdata.js相应接口，取得路径数据，遍历取最优路径，绘制在HomeScreen里的地图上
