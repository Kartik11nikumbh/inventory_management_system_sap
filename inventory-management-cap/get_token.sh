curl -s -X POST "https://4b4624aftrial.authentication.ap21.hana.ondemand.com/oauth/token" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  --data-urlencode "grant_type=client_credentials" \
  --data-urlencode "client_id=sb-6c9087e6-fdd6-4efa-a217-22676bca420b!b121497|html5-apps-repo-uaa!b7" \
  --data-urlencode "client_secret=288c1e7f-1f48-498c-a48b-e0058545a8c1$o_s01747nmPZAqDMp96D7XDmaoPoiCCy6WhE1nGHTdU=" > token.json
python3 -c "import json; d=json.load(open('token.json')); print(d.get('access_token','ERROR:'+str(d))[:200])"
