#source for css: http://startbootstrap.com/template-overviews/sb-admin/
#source for ohmage client: https://github.com/ohmage/ohmage-python-client
#source for moves data: https://github.com/jplattel/pymoves
from flask import Flask, render_template
from ohmagekit.clients import ohmage as ohmage
import json
from moves import Moves


app = Flask(__name__)

@app.route("/")
def main():
    return render_template('index.html')

@app.route("/charts")
def charts():
    return render_template('charts.html')

@app.route("/survey", methods=['GET'])
def survey():
    return json.dumps([getSurveyData("hshimiao", "huangshimiao"), getSurveyData("rchen27", "hTech2015")])

@app.route("/moves", methods=['GET'])
def moves():
    return json.dumps([getMovesData('9wa7Z7ck5ohO9yEU16AktU7le660TBnlQZja6Bx4919lmw7t2A4H4M4478wZBRPM'), getMovesData('M3oJ62VWeBeIv2KFZ3KIWzmUIo7uODkB4JO8nh502hjCAbidbKtCruG8hVb1aL7o')])

@app.route("/table", methods=['GET'])
def table():
    result = []
    result.append(getTableData("hshimiao", "huangshimiao", 24501, '9wa7Z7ck5ohO9yEU16AktU7le660TBnlQZja6Bx4919lmw7t2A4H4M4478wZBRPM'))
    result.append(getTableData("rchen27", "hTech2015", 24502, 'M3oJ62VWeBeIv2KFZ3KIWzmUIo7uODkB4JO8nh502hjCAbidbKtCruG8hVb1aL7o'))
    return json.dumps(result)

'''
Parses data and formats it for table
'''
def getTableData(user, pw, pid, token):
    movesData = getMovesData(token)
    moves = movesData['activity']
    survey = getSurveyData(user, pw)
    result = {}
    adherence = ''
    if (len(survey) < 4):
    	adherence = 'Low'
    elif (len(survey) < 9):
    	adherence = 'Medium'
    else:
    	adherence = 'High'
    result['adherence'] = adherence
    pain = 0.0
    for res in survey:
    	pain += int(res['responses']['averagePainIntensity']['prompt_response'])
    	pain += 2 * int(res['responses']['painInterferenceDayToDayActivities']['prompt_response'])
    pain = pain / (len(survey) * 2)
    painCategory = ''
    if (pain < 4):
    	painCategory = 'Low'
    elif (pain < 8):
    	painCategory = 'Medium'
    else:
    	painCategory = 'High'
    result['pain'] = painCategory
    steps = 0.0
    for day in moves:
        if day['summary'] is not None:
            for activity in day['summary']:
                if activity["activity"] == 'walking':
                    steps += activity['steps']
    steps = steps / (len(moves))
    activityLevel = ''
    if (steps < 3000):
        activityLevel = 'Low'
    elif (steps < 7000):
        activityLevel = 'Medium'
    else:
        activityLevel = 'High'
    result['activity'] = activityLevel
    result['id'] = pid
    locations = movesData['locations']
    numPlaces = 0.0
    for day in locations:
        if day['segments'] is not None:
            for l in day['segments']:
                if l["type"] == 'place':
                    numPlaces += 1.0
    numPlaces = numPlaces / len(locations)
    mobility = ''
    if numPlaces < 2:
        mobility = 'Low'
    elif numPlaces < 4:
        mobility = 'Medium'
    else:
        mobility = 'High'
    result['mobility'] = mobility
    return result

#pull suvey data from ohmage
def getSurveyData(user, pw):
    api = ohmage.OhmageApi("https://play.ohmage.org")
    #api.login("rchen27", "hTech2015")
    #api.login("hshimiao", "huangshimiao")
    api.login(user, pw)

    try:
        result = api.campaign_read(output_format="short")
    except Exception as e:
        print e
        raise
    myCamp = ''
    for urn, campaign in result['data'].items():
        if campaign['name'] == 'Lower Back Pain':
        	myCamp = urn
        	#print "Campaign %s has URN %s" % (campaign['name'], urn)

    try:
        surveys = api.survey_response_read(campaign_urn=myCamp, output_format="json-rows", column_list="urn:ohmage:special:all", user_list="urn:ohmage:special:all", survey_id_list="promisThreeItemPainIntensityShortForm")
        data = surveys['data']
        return data
    except Exception as e:
        print e

#pull in moves data
#$ pip install pyopenssl ndg-httpsclient pyasn1
# pip install requests[security]
def getMovesData(access_token):
    m = Moves('7Hm10S57XPS5B0418701Tcrh7BQuh6vX', 'GfKQCmKINefICnwp506KeszarTe97XS_S1WHJjX5711143D3K43AX420gyKsItQ1', 'www.google.com')
    #request_url = m.request_url()
    #print request_url

    #access_token = m.auth('6pMdbze7qrYOu54s076lU8J61kHhM2H63VytMC0Pt1I9t_AAop4GIiGUd9q7L3GX')
    #print access_token

    #access token for user 1
    #access_token = 'M3oJ62VWeBeIv2KFZ3KIWzmUIo7uODkB4JO8nh502hjCAbidbKtCruG8hVb1aL7o'
    #access_token = '9wa7Z7ck5ohO9yEU16AktU7le660TBnlQZja6Bx4919lmw7t2A4H4M4478wZBRPM'
    data = {}
    data['activity'] = m.get_summary(access_token, '201510') + m.get_summary(access_token, '201511')
    data['locations'] = m.get_locations(access_token, '201510') + m.get_locations(access_token, '201511')
    return data

if __name__ == "__main__":
    app.run(debug=True)