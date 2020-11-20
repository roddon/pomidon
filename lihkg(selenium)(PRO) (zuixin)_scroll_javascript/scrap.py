from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
import openpyxl
from bs4 import BeautifulSoup
import pandas as pd
import time
from datetime import datetime, timedelta
import os
import sys
import math
import re
import http.client
import urllib
import _thread

popularUrl='https://lihkg.com/category/5?order=now'
baseUrl= "https://lihkg.com"
LOGINTIME= 10
TIMEOUT = 2

def saveInJson(data):
    f= open('posts.json', 'w', encoding='utf-8')
    f.write(json.dumps(data, ensure_ascii=False))
    f.close()
    print('Saved successfully!')

class PostScraper(QWidget):
    def __init__(self):
        super().__init__()
        self.status= "Let's start"
        self.initUI()
        
    def initUI(self):
        grid = QGridLayout()
        grid.setSpacing(10)
        self.btn_ok = QPushButton('OK', self)
        self.l1= QLabel()
        self.l1.setText(self.status)
        # self.btn_ok.setDisabled(True)
        self.btn_ok.clicked.connect(self.start)
        grid.addWidget(self.l1, 1, 1, 1, 1)
        grid.addWidget(self.btn_ok, 2, 1, 1, 1)
        self.setWindowTitle("Scrap")
        self.setLayout(grid)
        self.setContentsMargins(20, 20, 20, 20)
        self.setGeometry(300, 300, 200, 50)
        self.show()
    def start(self):
        _thread.start_new_thread( self.scrape, () )
    def headlessDriver(self):
        chrome_options = Options()
        chrome_options.add_argument("--headless")
        chrome_options.add_argument(f"--window-size=1920, 900")
        chrome_options.add_argument("--hide-scrollbars")
        driver = webdriver.Chrome(options=chrome_options, executable_path="chromedriver86.exe")
        return driver
    def headDriver(self):
        options = Options()
        options.headless = False
        options.add_argument("--window-size=1920,1200")
        try:
            driver = webdriver.Chrome(options=options, executable_path="chromedriver86.exe")
            return driver
        except:
            print("You must install chrome 86!")
            return 0
    def load(self, filename):
        f = open(filename, "r")
        itemUrls= []
        for x in f:
            itemUrls.append(x)
        f.close()
        return itemUrls

    def Reverse(self, lst): 
        return [ele for ele in reversed(lst)] 


    def scrape(self):
        self.l1.setText("Now collecting data")
        toJson=[]
        # get item urls
        driver= self.headDriver()
        driver.get(popularUrl)
        time.sleep(LOGINTIME)

        read_mores = driver.find_elements_by_xpath('//a[text()="Read More..."]')

        for read_more in read_mores:
            driver.execute_script("arguments[0].scrollIntoView();", read_more)
            driver.execute_script("$(arguments[0]).click();", read_more)
        flag= True
        while flag :
            time.sleep(1)
            recentList = driver.find_elements_by_xpath("//span[@class='_2XYV9mzvNkG4Tz2j_Ve1SR']")
            if len(recentList) == 0 :
                break
            else :
                driver.execute_script("arguments[0].scrollIntoView();", recentList[len(recentList) - 1 ] )
                if driver.find_elements_by_xpath("//span[@class='_2XYV9mzvNkG4Tz2j_Ve1SR']")[-1].text.strip().split(" ")[1]== "日前":
                    print("wery good")
                    flag= False


        soup = BeautifulSoup(driver.page_source, 'html.parser')
        postDoms= soup.find_all('div', attrs={'class':'wQ4Ran7ySbKd8PdMeHZZR'})
        postClicks= driver.find_elements_by_xpath("//a[@class='_2A_7bGY9QAXcGu1neEYDJB']")
        threadIdDoms = soup.find_all('a', attrs={'class':'_2A_7bGY9QAXcGu1neEYDJB'})
        threadIds= []
        for threadIdDom in threadIdDoms:
            alink = threadIdDom.attrs['href']
            threadId= alink.split("/thread/", 1)[1].split("/page", 1)[0]
            threadIds.append(threadId)
        clickNum= 0
        
        for postDom in postDoms:
            if clickNum== len(postClicks)-2:
                break
            # if don't exist comment in 24hours break
            lastCommentDom= postDom.find('span', attrs= {'class':'_2XYV9mzvNkG4Tz2j_Ve1SR'})
            if lastCommentDom!= None:
                lastComment= lastCommentDom.text.strip().split(" ")[1]
                if lastComment== "日前" or lastComment== "個月前" or lastComment== "年前":
                    break

            postName= postDom.find('span', attrs={'class':'_20jopXBFHNQ9FUbcGHLcHH'}).text
            postLike= 0
            if postDom.find('span', attrs={'class':'_3suk2CCJTOqiFHplkp02fP'})!= None:
                postLike= postDom.find('span', attrs={'class':'_3suk2CCJTOqiFHplkp02fP'}).text
            postPageNums= 1
            if postDom.find('div', attrs={'class':'_26oEXjfUS_iHzbxYcZE6bD'})!= None:
                postPageNums= int(postDom.find('div', attrs={'class':'_26oEXjfUS_iHzbxYcZE6bD'}).text.strip().split(" ")[0])
            post= {}
            post['threadId']= threadIds[clickNum]
            post['postName']= postName
            post['postLike']= postLike
            
            postClicks[clickNum].click()
            time.sleep(TIMEOUT)

            pageSoup1= BeautifulSoup(driver.page_source, 'html.parser')
            commentDomForPT= pageSoup1.find('div', attrs={'class':'_36ZEkSvpdj_igmog0nluzh'})
            postTimestamp= 0
            posttime= datetime.now().strftime("%d/%m/%Y %H:%M:%S")
            if commentDomForPT.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'})!= None and len(commentDomForPT.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'}).text.split(" "))>=2:
                postTimestamp= int(commentDomForPT.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'}).text.split(" ")[0])
                postTimeDay= commentDomForPT.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'}).text.split(" ")[1].strip()
                # if postTimeDay== "日前" or postTimeDay== "個月前" or postTimeDay== "年前":
                #     clickNum+= 1
                #     print("postOk")
                #     continue
                # if postTimeDay== "分鐘前":
                #     postTimestamp= float(postTimestamp/60)
                posttmp= commentDomForPT.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'})
                posttime= posttmp.attrs['title']
            post['postTime']= posttime
            # pageUrl= postDom.find('a', attrs={'class':'_2A_7bGY9QAXcGu1neEYDJB'}).attrs['href']
            # driver.get(baseUrl+pageUrl)
            comments=[]
            try:
                javascript1 = "document.getElementsByClassName('_3IN5-WbppwUe2EeMjlVoHz')[0].setAttribute('style', 'display: none;');"
                javascript2 = "document.getElementsByClassName('_1ByCoA3XapNi7uIVAh-3uY')[0].setAttribute('style', 'display: none;');"
                driver.execute_script(javascript1)
                driver.execute_script(javascript2)
            except:
                pass
            if postPageNums >50:
                postPageNums= 50
            for i in range(postPageNums):
                if len(driver.find_elements_by_xpath("//div[@class='_3omJTNzI7U7MErH1Cfr3gE']"))>=3:
                    try:
                        driver.find_elements_by_xpath("//div[@class='_3omJTNzI7U7MErH1Cfr3gE']")[-1].click()
                        time.sleep(2)
                    except:
                        time.sleep(10)
                        driver.find_elements_by_xpath("//div[@class='_3omJTNzI7U7MErH1Cfr3gE']")[-1].click()

            # while postPageNums :
            #     time.sleep(2)
            #     recentComment = driver.find_elements_by_xpath("//div[@class='_36ZEkSvpdj_igmog0nluzh']")
            #     if len(recentComment) == 0 :
            #         break
            #     else :
            #         driver.execute_script("arguments[0].scrollIntoView();", recentComment[len(recentComment) - 1 ] )
            #         postPageNums-= 1
                
            #     time.sleep(2)
            # get all comments according to the post
            pageSoup= BeautifulSoup(driver.page_source, 'html.parser')
            commentDoms= pageSoup.find_all('div', attrs={'class':'_36ZEkSvpdj_igmog0nluzh'})
            commentDoms.reverse()
            for commentDom in commentDoms:
                comment= {}
                commentId= "Empty"
                if commentDom.find('span', attrs= {'class': '_3SqN3KZ8m8vCsD9FNcxcki _208tAU6LsyjP5LKTdcPXD0'})!= None:
                    commentId= commentDom.find('span', attrs= {'class': '_3SqN3KZ8m8vCsD9FNcxcki _208tAU6LsyjP5LKTdcPXD0'}).text.strip().split("#")[1]
                elif commentDom.find('span', attrs= {'class': '_3SqN3KZ8m8vCsD9FNcxcki'})!= None:
                    commentId= commentDom.find('span', attrs= {'class': '_3SqN3KZ8m8vCsD9FNcxcki'}).text.strip().split("#")[1]
                comment['commentId']= commentId
                commentWriter= "Empty"
                if commentDom.find('span', attrs={'class':'ZZtOrmcIRcvdpnW09DzFk'})!= None:
                    commentWriter= commentDom.find('span', attrs={'class':'ZZtOrmcIRcvdpnW09DzFk'}).text
                comment['commentWriter']= commentWriter
                commentTimestamp= 0
                comtime= datetime.now().strftime("%d/%m/%Y %H:%M:%S")
                if commentDom.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'})!= None and len(commentDom.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'}).text.split(" "))>=2:
                    commentTimestamp= int(commentDom.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'}).text.split(" ")[0])
                    commentTimeDay= commentDom.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'}).text.split(" ")[1].strip()
                    if commentTimeDay== "日前" or commentTimeDay== "個月前" or commentTimeDay== "年前":
                        print("commentOk")
                        break
                    if commentTimeDay== "分鐘前":
                        commentTimestamp= float(commentTimestamp/60)
                    comtmp= commentDom.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'})
                    comtime= comtmp.attrs['title']
                times= comtime
                comment['commentTime']= times
                commentContent= "Empty"
                if commentDom.find('div', attrs={'class':'_2cNsJna0_hV8tdMj3X6_gJ'})!= None:
                    commentContent= commentDom.find('div', attrs={'class':'_2cNsJna0_hV8tdMj3X6_gJ'}).text
                elif commentDom.find('div', attrs={'class':'oStuGCWyiP2IrBDndu1cY'})!= None:
                    commentContent= commentDom.find('div', attrs={'class':'oStuGCWyiP2IrBDndu1cY'}).text
                comment['commentContent']= commentContent
                commentLike= 0
                commentDislike= 0
                if len(commentDom.find_all('label', attrs={'class':'IaEsn1SdyIFGVnMWy02Or _1drI9FJC8tyquOpz5QRaqf'}))>=2:
                    commentLike= commentDom.find_all('label', attrs={'class':'IaEsn1SdyIFGVnMWy02Or _1drI9FJC8tyquOpz5QRaqf'})[0].text
                    commentDislike= commentDom.find_all('label', attrs={'class':'IaEsn1SdyIFGVnMWy02Or _1drI9FJC8tyquOpz5QRaqf'})[1].text
                comment['commentLike']= commentLike
                comment['commentDislike']= commentDislike
                comments.append(comment)
            post['comments']= comments
            toJson.append(post)
            saveInJson(toJson)
            clickNum+= 1
        self.l1.setText("Done!")

        
if __name__ == '__main__':
    app = QApplication(sys.argv)
    ex = PostScraper()
    sys.exit(app.exec_())