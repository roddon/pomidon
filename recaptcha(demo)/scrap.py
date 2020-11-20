import json
import requests
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
import openpyxl
from bs4 import BeautifulSoup
import pandas as pd
import time
import os
import math
import re

TIMEOUT = 0.5
LOGINTIME= 5

class CaridScraper():
    def __init__(self):
        self.oneBranch_url = "https://www.carid.com/dash-kits.html?filter=1&per-page=90"
        self.base_url = "https://www.carid.com/honda-oem-ac-heating-parts/"
        self.firm_url= "https://www.carid.com"
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

    def scrape(self):
        pageurl = 'https://www.carid.com/dash-kits.html?filter=1&per-page=90'
        driver= self.headDriver()
        driver.get(pageurl)
        site_key= "6LfOmnsUAAAAAMGaFTeE53cUKc4hSoTxtF0SlfdB"
        api_key= "7ec035bc4dde532d6f3319dd23cda6c8"
        form = {"method": "userrecaptcha",
                "googlekey": site_key,
                "key": api_key, 
                "pageurl": pageurl, 
                "json": 1}

        response = requests.post('http://2captcha.com/in.php', data=form)
        request_id = response.json()['request']
        print(request_id)
        # write csv headers
        url = f"http://2captcha.com/res.php?key={api_key}&action=get&id={request_id}&json=1"

        status = 0
        while not status:
            res = requests.get(url)
            if res.json()['status']==0:
                time.sleep(3)
            else:
                requ = res.json()['request']
                js = f'document.getElementById("g-recaptcha-response").innerHTML="{requ}";'
                driver.execute_script(js)
                print("very ok")
                time.sleep(1000)
                status = 1

           
if __name__ == '__main__':
    scraper = CaridScraper()
    scraper.scrape()