import selenium
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from bs4 import BeautifulSoup
import pandas as pd
import time
import os

options = Options()
options.headless = False
options.add_argument("--window-size=1920,1200")
driver = webdriver.Chrome(options=options, executable_path="chromedriver86.exe")
#chrome version 86

class URLScraper():
    def __init__(self):
        self.All_url = "https://www.amazon.de/gp/bestsellers/ref=zg_bs_unv_0_9418401031_2"

    def scrape(self):
        self.select_scrap(self.All_url)

    def select_scrap(self, base_url):
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
                        sel_url3 = url3[url3_num].find('a').attrs['href']
                        catagoryid = catagoryid + 1
                        new = (sel_url3, catagoryid)
                        items.append(new)

                else:
                    new = (sel_url2, parentid)
                    items.append(new)
                    
        return items
if __name__ == '__main__':
    scraper = URLScraper()
    scraper.scrape()
