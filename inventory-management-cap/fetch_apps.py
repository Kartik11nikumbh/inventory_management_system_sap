import urllib.request
import urllib.parse
import json

url = "https://4b4624aftrial.authentication.ap21.hana.ondemand.com/oauth/token"
data = urllib.parse.urlencode({
    "grant_type": "client_credentials",
    "client_id": "sb-6c9087e6-fdd6-4efa-a217-22676bca420b!b121497|html5-apps-repo-uaa!b7",
    "client_secret": "288c1e7f-1f48-498c-a48b-e0058545a8c1$o_s01747nmPZAqDMp96D7XDmaoPoiCCy6WhE1nGHTdU="
}).encode()
req = urllib.request.Request(url, data=data, headers={"Content-Type": "application/x-www-form-urlencoded"})
token = json.loads(urllib.request.urlopen(req).read())["access_token"]
req2 = urllib.request.Request("https://html5-apps-repo-rt.cfapps.ap21.hana.ondemand.com/applications/metadata/", headers={"Authorization": "Bearer " + token})
print(urllib.request.urlopen(req2).read().decode())
