from PyQt5.QtGui import *
from PyQt5.QtWidgets import *
from PyQt5.QtCore import *
import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
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

popularUrl='https://lihkg.com/category/5?order=hot'
baseUrl= "https://lihkg.com"
LOGINTIME= 10
TIMEOUT = 2

def scroll_to_bottom(driver):

    old_position = 0
    new_position = None

    while new_position != old_position:
        # Get old scroll position
        old_position = driver.execute_script(
                ("return (window.pageYOffset !== undefined) ?"
                " window.pageYOffset : (document.documentElement ||"
                " document.body.parentNode || document.body);"))
        # Sleep and Scroll
        time.sleep(1)
        driver.execute_script((
                "var scrollingElement = (document.scrollingElement ||"
                " document.body);scrollingElement.scrollTop ="
                " scrollingElement.scrollHeight;"))
        # Get new position
        new_position = driver.execute_script(
                ("return (window.pageYOffset !== undefined) ?"
                " window.pageYOffset : (document.documentElement ||"
                " document.body.parentNode || document.body);"))
def scroll_bottom(driver):
    lenOfPage = driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return 1000;")
    match=False
    while(match==False):
        lastCount = lenOfPage
        time.sleep(3)
        lenOfPage = driver.execute_script("window.scrollTo(0, document.body.scrollHeight);var lenOfPage=document.body.scrollHeight;return lenOfPage;")
        if lastCount==lenOfPage:
            match=True
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
    

    def scrape(self):
        self.l1.setText("Now collecting data")
        toJson=[]
        # get item urls
        driver= self.headDriver()
        driver.get(popularUrl)
        time.sleep(LOGINTIME)
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
            postName= postDom.find('span', attrs={'class':'_20jopXBFHNQ9FUbcGHLcHH'}).text
            postLike= 0
            if postDom.find('span', attrs={'class':'_3suk2CCJTOqiFHplkp02fP'})!= None:
                postLike= postDom.find('span', attrs={'class':'_3suk2CCJTOqiFHplkp02fP'}).text
            postPageNums= 1
            if postDom.find('div', attrs={'class':'_26oEXjfUS_iHzbxYcZE6bD'})!= None:
                postPageNums= postDom.find('div', attrs={'class':'_26oEXjfUS_iHzbxYcZE6bD'}).text.strip().split(" ")[0]
            post= {}
            post['threadId']= threadIds[clickNum]
            post['postName']= postName
            post['postLike']= postLike
            postTimestamp= 0
            if postDom.find('span', attrs={'class':'_2XYV9mzvNkG4Tz2j_Ve1SR'})!= None:
                postTimestamp= postDom.find('span', attrs={'class':'_2XYV9mzvNkG4Tz2j_Ve1SR'}).text.split(" ")[0]
            posttimes= datetime.now()+timedelta(hours=-int(postTimestamp))
            post['postTime']= posttimes.strftime("%d/%m/%Y %H:%M:%S")
            postClicks[clickNum].click()
            time.sleep(TIMEOUT)
            # pageUrl= postDom.find('a', attrs={'class':'_2A_7bGY9QAXcGu1neEYDJB'}).attrs['href']
            # driver.get(baseUrl+pageUrl)
            comments=[]
            for i in range(int(postPageNums)+3):
                if len(driver.find_elements_by_xpath("//div[@class='_3omJTNzI7U7MErH1Cfr3gE']"))>=3:
                    try:
                        driver.find_elements_by_xpath("//div[@class='_3omJTNzI7U7MErH1Cfr3gE']")[-1].click()
                        time.sleep(2)
                    except:
                        pass
            # get all comments according to the post
            pageSoup= BeautifulSoup(driver.page_source, 'html.parser')
            commentDoms= pageSoup.find_all('div', attrs={'class':'_36ZEkSvpdj_igmog0nluzh'})
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
                if commentDom.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'})!= None:
                    commentTimestamp= commentDom.find('span', attrs={'class':'Ahi80YgykKo22njTSCzs_'}).text.split(" ")[0]
                times= datetime.now()+timedelta(hours=-int(commentTimestamp))
                comment['commentTime']= times.strftime("%d/%m/%Y %H:%M:%S")
                commentContent= "Empty"
                if commentDom.find('div', attrs={'class':'GAagiRXJU88Nul1M7Ai0H'})!= None:
                    commentContent= commentDom.find('div', attrs={'class':'GAagiRXJU88Nul1M7Ai0H'}).text
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