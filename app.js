const Koa = require('koa');
const schedule = require('node-schedule')
const request = require('request')

const app = new Koa();

const { sessionid, aid, uuid, _signature } = require('./config')

const BASEURL = 'https://api.juejin.cn/growth_api/v1/check_in'
const URL = `${BASEURL}?aid=${aid}&uuid=${uuid}&_signature=${_signature}`


function signIn () {
	return new Promise((resolve, reject) => {
		request(
			{
			    url: URL,
			    method: "POST",
			    headers: {
			      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4840.0 Safari/537.36',
			      Cookie: 'sessionid=' + sessionid
			    }
		 	},
		 	function (error, response, body) {
		 		console.log(error, response, body)
		 		resolve(response)
		 	}
		)
	})
}

const rule = '30 10 0 * * *'; // 每天的凌晨0点10分30秒触发'

// 定时任务
const scheduleCronstyle = () => {
    schedule.scheduleJob(rule, () => {
        signIn();
    });
}

app.use(async ctx => {
  ctx.body = '服务正在运行中...';
});

app.listen(8010, () => {
	console.log('服务已启动...')

	scheduleCronstyle(); // 定时启动
})
