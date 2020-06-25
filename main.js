// 初始化 speechSynthesis API
const synth = window.speechSynthesis
// 获取 DOM 节点
const body = document.querySelector('body')
const textForm = document.querySelector('form')
const textInput = document.querySelector('#text-input')
const voiceSelect = document.querySelector('#voice-select')
const rate = document.querySelector('#rate')
const rateValue = document.querySelector('#rate-value')
const pitch = document.querySelector('#pitch')
const pitchValue = document.querySelector('#pitch-value')

let voices = []

function getVoiceList() {
	voices = synth.getVoices()
	// 循环 voices 数组，并逐一创建一个 option
	voices.forEach((voice) => {
		const option = document.createElement('option')
		option.textContent = voice.name
		// 设置 option 属性
		option.setAttribute('data-lang', voice.lang)
		option.setAttribute('data-name', voice.name)
		voiceSelect.appendChild(option)
	})
}
// synth.getVoices() 为异步执行
// synth.getVoices() 方法将在 synth.onvoiceschanged 触发时运行
// 因此须有如下语句，否则 synth.getVoices() 返回空数组
getVoiceList()
if (synth.onvoiceschanged !== undefined) {
	synth.onvoiceschanged = getVoiceList
}
// 发音方法
function speakIt() {
	// 若正在发音则直接返回
	if (synth.speaking) {
		return
	}
	if (textInput.value != '') {
		// 添加 gif 动画
		body.style.background = '#141414 url(./img/wave.gif) repeat'
		body.style.backgroundPositionY = '-50px'
		// 获取发音文本
		const speakText = new SpeechSynthesisUtterance(textInput.value)
		// 发音结束后触发的方法
		speakText.onend = (e) => {
			body.style.background = '#141414'
		}
		// 发音出错是触发的方法
		speakText.onerror = (e) => {
			alert('出现错误，请重试。')
		}
		// 获取 select 框当前选中的语言项并获取其 data-name 属性值
		const selectVoice = voiceSelect.selectedOptions[0].getAttribute('data-name')
		// 遍历 voices 数组，在 voice.name 中找到与上方 select 中选择的语言一致的选项
		// 并把它赋值给 speakText.voice
		voices.forEach((voice) => {
			if (voice.name === selectVoice) {
				speakText.voice = voice
			}
		})
        // 设置发音速率
        speakText.rate = rate.value
        // 设置发音音调
		speakText.pitch = pitch.value
        // 开始发音
		synth.speak(speakText)
	}
}
// 提交表单
textForm.addEventListener('submit', (e) => {
	e.preventDefault()
	speakIt()
})
// 改变速率右侧的数值
rate.addEventListener('change', (e) => {
	rateValue.textContent = rate.value
})
// 改变音调右侧的数值
pitch.addEventListener('change', (e) => {
	pitchValue.textContent = pitch.value
})
