const Koa = require('koa');
const schedule = require('node-schedule')
const request = require('request')

const app = new Koa();

const { sessionid, aid, uuid, _signature, cookieList } = require('./config')

const BASEURL = 'https://api.juejin.cn/growth_api/v1'
const SIGNURL = `${BASEURL}/check_in?aid=${aid}&uuid=${uuid}&_signature=${_signature}`	// 签到
const LDURL = `${BASEURL}/lottery/draw?aid=${aid}&uuid=${uuid}&_signature=${_signature}`	// 抽奖


function signIn () {
	return new Promise((resolve, reject) => {
		request(
			{
			    url: SIGNURL,
			    method: "POST",
			    headers: {
			      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4840.0 Safari/537.36',
			      Cookie: 'sessionid=' + sessionid
			    }
		 	},
		 	function (error, response, body) {
		 		resolve(response)
		 	}
		)
	})
}

function luckDraw () {
	return new Promise((resolve, reject) => {
		request(
			{
			    url: LDURL,
			    method: "POST",
			    headers: {
			      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4840.0 Safari/537.36',
			      Cookie: cookieList
			    }
		 	},
		 	function (error, response, body) {
		 		resolve(body)
		 	}
		)
	})
}

const rule = '30 10 0 * * *'; // 每天的凌晨0点10分30秒触发

// 定时任务
const scheduleCronstyle = () => {
    schedule.scheduleJob(rule, async () => {
        const signRes = await signIn();
        const dlRes = await luckDraw();
    });
}

app.use(async ctx => {
  ctx.body = '服务正在运行中...';
});

app.listen(8010, async () => {
	console.log('服务已启动...')

	scheduleCronstyle(); // 定时启动


})
