import json
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import openpyxl
from bs4 import BeautifulSoup
import pandas as pd
import time
import os
import math
import re
import mysql.connector
import _thread

baseUrl= 'https://www.amazon.de'
url='https://www.amazon.de/gp/bestsellers/?ref_=nav_cs_bestsellers'
scrapeUrl= 'https://www.amazon.de/gp/bestsellers/boost/9418400031/ref=zg_bs_nav_2_9418396031'
TIMEOUT = 2

mydb = mysql.connector.connect(
    host="localhost",
    user="root",
    password="",
    database="amazon"
)

mycursor = mydb.cursor()


class BestSellerScraper():
    #this is for making driver
    def __init__(self):
        self.threadFlag= 0
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

    def select_scrap(self, base_url):
        driver= self.headDriver()
        driver.get(base_url)
        time.sleep(5)
        soup = BeautifulSoup(driver.page_source, 'html.parser')
        url1 = soup.find('ul', attrs = {'id':'zg_browseRoot'})
        url1 = url1.find('ul')
        url1 = url1.find_all('li')
        num1 = len(url1)

        catagoryid = num1
        for url1_num in range(num1):
            sel_url1 = url1[url1_num].find('a').attrs['href']
            driver.get(sel_url1)
            time.sleep(3)
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            url2 = soup.find('ul', attrs = {'id':'zg_browseRoot'})
            url2 = url2.find('ul')
            url2 = url2.find('ul')
            url2 = url2.find_all('li')
            num2 = len(url2)

            for url2_num in range(num2):
                sel_url2 = url2[url2_num].find('a').attrs['href']
                catagoryid = catagoryid + 1

        parentid = num1
        items = []
        for url1_num in range(num1):
            sel_url1 = url1[url1_num].find('a').attrs['href']
            driver.get(sel_url1)
            time.sleep(3)
            soup = BeautifulSoup(driver.page_source, 'html.parser')
            url2 = soup.find('ul', attrs = {'id':'zg_browseRoot'})
            url2 = url2.find('ul')
            url2 = url2.find('ul')
            url2 = url2.find_all('li')
            num2 = len(url2)

            for url2_num in range(num2):
                sel_url2 = url2[url2_num].find('a').attrs['href']
                driver.get(sel_url2)
                time.sleep(3)
                soup = BeautifulSoup(driver.page_source, 'html.parser')
                url3 = soup.find('ul', attrs = {'id':'zg_browseRoot'})
                url3 = url3.find('ul')
                url3 = url3.find('ul')
                url3 = url3.find('ul')
                parentid = parentid + 1
                if url3 != None:
                    url3 = url3.find_all('li')
                    num3 = len(url3)

                    for url3_num in range(num3):
                        if url3[url3_num].find('a') != None:
                            sel_url3 = url3[url3_num].find('a').attrs['href']
                            catagoryid = catagoryid + 1
                            new = (sel_url3, catagoryid)
                            items.append(new)

                else:
                    new = (sel_url2, parentid)
                    items.append(new)
                    
        return items
    
    def modifyUrls(self, urls):
        modifiedUrls= []
        modifyNum= 10
        if len(urls)<= modifyNum:
            modifiedUrls.append(urls)
            return modifiedUrls
        else:
            modifiedUrlsLen= int(len(urls)/modifyNum)
            for i in range(modifiedUrlsLen):
                new= []
                for ii in range(modifyNum):
                    new.append(urls[ii+i*10])
                modifiedUrls.append(new)
            print(i)
            rest= []
            for iii in range(len(urls)- (i+1)*10):
                rest.append(urls[iii+(i+1)*10])
            modifiedUrls.append(rest)
        return modifiedUrls

    def urlscrape(self, unitUrl, categoryID):
        driver= self.headDriver()
        driver.get(unitUrl)
        time.sleep(TIMEOUT)

        soup = BeautifulSoup(driver.page_source, 'html.parser')
        itemDoms= soup.find_all('li', attrs={'class': 'zg-item-immersion'})
        items=[]
        for itemDom in itemDoms:
            ranking1= 0
            if itemDom.find('span', attrs= {'class': 'zg-badge-text'})!= None:
                ranking1= int(itemDom.find('span', attrs= {'class': 'zg-badge-text'}).text.strip('#'))
            # category1= '_'
            # if soup.find('span', attrs= {'class': 'zg_selected'})!= None:
            #     category1= soup.find('span', attrs= {'class': 'zg_selected'}).text
            description1= '_'
            if itemDom.find('div', attrs= {'class': 'p13n-sc-truncate-desktop-type2 p13n-sc-truncated'})!= None:
                description1= itemDom.find('div', attrs= {'class': 'p13n-sc-truncate-desktop-type2 p13n-sc-truncated'}).text
            imageUrl1= '_'
            if itemDom.find('img')!= None:
                imageUrl1= itemDom.find('img').attrs['src']
            price1= 0
            if itemDom.find('span', attrs= {'class': 'p13n-sc-price'})!= None:
                price1= float(itemDom.find('span', attrs= {'class': 'p13n-sc-price'}).text.strip('\xa0€').replace(',', '.'))
            averageRating1= 0
            if itemDom.find('span', attrs= {'class': 'a-icon-alt'})!= None:
                averageRating1= float(itemDom.find('span', attrs= {'class': 'a-icon-alt'}).text.split(' ')[0].replace(',', '.'))
            ratingCount1= 0
            if itemDom.find('a', attrs= {'class': 'a-size-small a-link-normal'})!= None:
                ratingCount1= int(itemDom.find('a', attrs= {'class': 'a-size-small a-link-normal'}).text.replace('.', ''))
            url1= baseUrl
            if itemDom.find('a', attrs= {'class': 'a-link-normal'})!= None:
                url1+= itemDom.find('a', attrs= {'class': 'a-link-normal'}).attrs['href']
            asin1= url1.split("/dp/", 1)[1].split("/ref=")[0]
            new= (ranking1, description1, imageUrl1, price1, averageRating1, ratingCount1, url1, asin1, categoryID)
            items.append(new)

            # sql = "INSERT INTO articles (ranking, description, imageUrl, price, averageRating, ratingCount, url, asin, category) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
            # mycursor.execute(sql, new)
            # mydb.commit()
            
        # writing in database
        sql = "INSERT INTO articles (ranking, description, imageUrl, price, averageRating, ratingCount, url, asin, category) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        mycursor.executemany(sql, items)

        mydb.commit()

        if soup.find('ul', attrs= {'class': 'a-pagination'})!= None:
            if len(soup.find('ul', attrs= {'class': 'a-pagination'}).find_all('li', attrs= {'class': 'a-normal'}))>= 1:
                newPage= soup.find('ul', attrs= {'class': 'a-pagination'}).find('li', attrs= {'class': 'a-normal'}).find('a').attrs['href']
                driver.get(newPage)
                time.sleep(TIMEOUT)

                soup = BeautifulSoup(driver.page_source, 'html.parser')
                itemDoms= soup.find_all('li', attrs={'class': 'zg-item-immersion'})
                items=[]
                for itemDom in itemDoms:
                    ranking1= 0
                    if itemDom.find('span', attrs= {'class': 'zg-badge-text'})!= None:
                        ranking1= int(itemDom.find('span', attrs= {'class': 'zg-badge-text'}).text.strip('#'))
                    # category1= '_'
                    # if soup.find('span', attrs= {'class': 'zg_selected'})!= None:
                    #     category1= soup.find('span', attrs= {'class': 'zg_selected'}).text
                    description1= '_'
                    if itemDom.find('div', attrs= {'class': 'p13n-sc-truncate-desktop-type2 p13n-sc-truncated'})!= None:
                        description1= itemDom.find('div', attrs= {'class': 'p13n-sc-truncate-desktop-type2 p13n-sc-truncated'}).text
                    imageUrl1= '_'
                    if itemDom.find('img')!= None:
                        imageUrl1= itemDom.find('img').attrs['src']
                    price1= 0
                    if itemDom.find('span', attrs= {'class': 'p13n-sc-price'})!= None:
                        price1= float(itemDom.find('span', attrs= {'class': 'p13n-sc-price'}).text.strip('\xa0€').replace(',', '.'))
                    averageRating1= 0
                    if itemDom.find('span', attrs= {'class': 'a-icon-alt'})!= None:
                        averageRating1= float(itemDom.find('span', attrs= {'class': 'a-icon-alt'}).text.split(' ')[0].replace(',', '.'))
                    ratingCount1= 0
                    if itemDom.find('a', attrs= {'class': 'a-size-small a-link-normal'})!= None:
                        ratingCount1= int(itemDom.find('a', attrs= {'class': 'a-size-small a-link-normal'}).text.replace('.', ''))
                    url1= baseUrl
                    if itemDom.find('a', attrs= {'class': 'a-link-normal'})!= None:
                        url1+= itemDom.find('a', attrs= {'class': 'a-link-normal'}).attrs['href']
                    asin1= url1.split("/dp/", 1)[1].split("/ref=")[0]
                    new= (ranking1, description1, imageUrl1, price1, averageRating1, ratingCount1, url1, asin1, categoryID)
                    items.append(new)

                sql = "INSERT INTO articles (ranking, description, imageUrl, price, averageRating, ratingCount, url, asin, category) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                mycursor.executemany(sql, items)

                mydb.commit()
        self.threadFlag+= 1
    def scrape(self):
        # # write csv headers
        # if os.path.exists('result.csv'):
        #     os.remove('result.csv')
        # columns=['Ranking', 'Category', 'Description', 'ImageUrl', 'Price', 'AverageRating', 'RatingCount', 'Url', 'Asin']
        # df = pd.DataFrame(columns = columns)
        # df.to_csv('result.csv', mode='x', index=False, encoding='utf-8-sig')
        urls=self.select_scrap(url)
        print('all deepest urls already ready!')
        modifiedUrls= self.modifyUrls(urls)
        for im in modifiedUrls:
            self.threadFlag= 0
            for i in im:
                categoryID= i[1]
                _thread.start_new_thread(self.urlscrape, (i[0], categoryID, ))
            while self.threadFlag!= len(im):
                time.sleep(2)
            print('ok! pass 10 thread once')
        mycursor.close()
        mydb.close()
        print('Done')

if __name__ == '__main__':
    scraper = BestSellerScraper()
    scraper.scrape()