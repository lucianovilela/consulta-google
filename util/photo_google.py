from apiclient.discovery import build
import os
def getPhotos(nome):
    service = build("customsearch", "v1",
                os.environ.get("developerKey"))
    res = service.cse().list(
        q=nome,
        cx=os.environ.get("cx"),
        searchType='image',
        num=3,
        imgType='photo',
        fileType='png',
        safe= 'off'
    ).execute()

    if not 'items' in res:
        return []
    else:
        return [{'title':item['title'], 'link':item['link']} for item in res['items']]
            
if __name__ == "__main__":
    for item in getPhotos("maradona"):
        print(f"{item['title']}  {item['link']}")