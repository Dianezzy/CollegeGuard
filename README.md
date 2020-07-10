# Google-Girl Hackathon-College Guard


## Instructions
### User Guide
1.Install APK  
We provide a link of our app(APK format) in submission form. If you have Android device, you can directly install it and run. Noted that our app is built for Andoid 9.0. So we recommend you to run it on the Android device with the version larger than 9.0.  
2.Notes  
(1) Our app need to get user's location, so at the first time you open our app, it will require location permission, please click "Always allow".   
(2) In our test, sometimes the map will not display at the first time, it is because the user location retrieval failed, please close the app and reopen it.  
(3) About the "JSON Parse Error": It demonstrates that the back-end cannot get population data successfully, the reason can be cookie expired / EasyGo limit, etc. At present, we could not find perfect solution of this problem except waiting or reopening.  

### Source Code Guide
1.Project Structure  
**assets**：Store fonts, images and other resources  
**components**：some UI components  
**constants**：global constants(color, Layout)  
**core**：  
	mapdata.js：fetch population data & route data from back-end  
	utils.js：Some util functions  
	UserDatabaseClient.js: some operations used in user module  
	Cache.js: store some cache info  
**navigation**：  
	HomeNavigator.js：navigation including home, shopping and personal center page  
	StartNavigator.js：navigation after app startup, including login, register and restore password page  
	screens：  
	StartScreen.js：Start interface  
	LoginScreen.js：Login interface  
	RegisterScreen.js：Register interface  
	ForgotPasswordScreen.js：Restore password interface  
	HomeScreen.js：Home interface & main logic in map module  
	PersonalCenterScreen.js：Personal center interface  
	purchase：Shopping module  
**shopping**：    
	CurrentOrder.js: Current order interface  
	HistoryOrder.js: History order interface  
	ShopCart.js: Shop cart interface  
	HomeComponent.js: shop interface  
	itemList.js: Shop item list interface  

