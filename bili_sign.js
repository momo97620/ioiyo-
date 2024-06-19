/**
 * 哔哩哔哩自动签到脚本
 * 适用于 Quantumult X
 * 
 * 请确保你已经登录哔哩哔哩，并且在 Quantumult X 中配置了 Cookie。
 */

const cookieName = 'Bilibili'
const cookieVal = '你的哔哩哔哩Cookie'  // 在这里填写你的哔哩哔哩 Cookie
const signurlVal = 'https://api.bilibili.com/x/web-interface/nav'  // 哔哩哔哩签到的 URL
const signheaderVal = JSON.stringify({
  'Cookie': cookieVal,
  'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.0 Mobile/15A372 Safari/604.1'
})
const signbodyVal = ''  // 如果需要 POST 请求的 body，可以在这里填写

const chavy = init()
const signinfo = {}

sign()

function sign() {
  const url = { url: signurlVal, headers: JSON.parse(signheaderVal), body: signbodyVal }
  chavy.post(url, (error, response, data) => {
    try {
      signinfo.sign = JSON.parse(data)
      if (signinfo.sign.code == 0) {
        chavy.msg(cookieName, `签到结果: 成功`, ``)
      } else {
        chavy.msg(cookieName, `签到结果: 失败`, `说明: ${signinfo.sign.message}`)
      }
    } catch (e) {
      chavy.msg(cookieName, `签到结果: 失败`, `说明: ${e}`)
    } finally {
      chavy.done()
    }
  })
}

function init() {
  isSurge = () => {
    return undefined === this.$httpClient ? false : true
  }
  isQuanX = () => {
    return undefined === this.$task ? false : true
  }
  getdata = (key) => {
    if (isSurge()) return $persistentStore.read(key)
    if (isQuanX()) return $prefs.valueForKey(key)
  }
  setdata = (key, val) => {
    if (isSurge()) return $persistentStore.write(val, key)
    if (isQuanX()) return $prefs.setValueForKey(val, key)
  }
  msg = (title, subtitle, body) => {
    if (isSurge()) $notification.post(title, subtitle, body)
    if (isQuanX()) $notify(title, subtitle, body)
  }
  log = (message) => console.log(message)
  get = (url, cb) => {
    if (isSurge()) {
      $httpClient.get(url, cb)
    }
    if (isQuanX()) {
      url.method = 'GET'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  post = (url, cb) => {
    if (isSurge()) {
      $httpClient.post(url, cb)
    }
    if (isQuanX()) {
      url.method = 'POST'
      $task.fetch(url).then((resp) => cb(null, resp, resp.body))
    }
  }
  done = (value = {}) => {
    $done(value)
  }
  return { isSurge, isQuanX, getdata, setdata, msg, log, get, post, done }
}
