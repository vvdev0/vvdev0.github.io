//const botID = document.getElementById('bot-widget-script').getAttribute('customer');

///////////////////////////////////// CUSTOMIZATION VARIABLES ////////////////////////////////////
const RC_userInputTextPlaceholder = 'Scrie mesajul tau aici.';
const RC_firstBotMessage = 'Salut! Eu sunt Maria. Cu ce te pot ajuta?';
const RC_noEntryBotMessage = 'Te rog sa scrii un mesaj!';
const RC_botErrorMessage = 'Am o eroare de comunicare cu serverul. Te rog sa incerci din nou mai tarziu.';

const RC_userAvatarSrc = 'https://robochat.pro/vlad/icons/userAvatar.png';
const RC_botAvatarSrc = 'https://robochat.pro/vlad/icons/botAvatarMaria.png';
///////////////////////////////////////// OTHER VARIABLES /////////////////////////////////////////
let overflowChecked = false;
/////////////////////////////////////////// DOM ELEMENTS //////////////////////////////////////////

const chatSection = document.getElementById('chat-section');
const conversation = document.getElementById('conversation');
const userInputText = document.getElementById('user-input-text');
const userInputButton = document.getElementById('user-input-btn');
const downloadButton = document.getElementById('download-conversation');

//////////////////////////////// HISTORY VARS AND FUNCTIONS ///////////////////////////////
const conversationHistory = [];

const addMessageToHistory = (role, message, time) => {
	conversationHistory.push({
		role: role,
		message: message,
		timestamp: time,
	});
};

function downloadConvo() {
	var jsonString = JSON.stringify(conversationHistory);
	var blob = new Blob([jsonString], { type: 'application/json' });
	var downloadLink = document.createElement('a');

	downloadLink.download = 'conversationData.json';
	downloadLink.href = window.URL.createObjectURL(blob);

	document.body.appendChild(downloadLink);
	downloadLink.click();
	document.body.removeChild(downloadLink);
}

///////////////////////////////////// HELPER FUNCTIONS ////////////////////////////////////

// const splitLongText = (longText) => {
// 	const delimiters = /(?<=[.!?])\s*/;
// 	const substrings = longText.split(delimiters);
// 	const groupedSubstrings = [];
// 	let currentGroup = '';
// 	let groupCharacterCount = 0;

// 	substrings.forEach((substring) => {
// 		const substringCharacterCount = substring.length;
// 		if (groupCharacterCount + substringCharacterCount > 160) {
// 			groupedSubstrings.push(currentGroup.trim());
// 			currentGroup = substring;
// 			groupCharacterCount = substringCharacterCount;
// 		} else {
// 			if (currentGroup !== '') {
// 				currentGroup += ' ';
// 			}
// 			currentGroup += substring;
// 			groupCharacterCount += substringCharacterCount;
// 		}
// 	});
// 	groupedSubstrings.push(currentGroup.trim());

// 	return groupedSubstrings;
// };

const splitLongText = (longText) => {
	const delimiters = /(?<=[.!?])\s*/;
	const substrings = longText.split(delimiters);
	const groupedSubstrings = [];
	let currentGroup = '';
	let groupCharacterCount = 0;

	substrings.forEach((substring) => {
		// Remove single digit at the end of a substring after a period
		if (substring.match(/\.\d$/)) {
			substring = substring.slice(0, -2); // Remove the last two characters
		}

		const substringCharacterCount = substring.length;
		// Check if the substring is not empty after removing the single digit
		// and also ensure the substring is not just one character long
		if (substringCharacterCount > 1) {
			if (groupCharacterCount + substringCharacterCount > 160) {
				groupedSubstrings.push(currentGroup.trim());
				currentGroup = substring;
				groupCharacterCount = substringCharacterCount;
			} else {
				if (currentGroup !== '') {
					currentGroup += ' ';
				}
				currentGroup += substring;
				groupCharacterCount += substringCharacterCount;
			}
		}
	});
	groupedSubstrings.push(currentGroup.trim());

	return groupedSubstrings;
};

const readTimestamp = (ts) => {
	let date = new Date(ts);
	var year = date.getFullYear();
	var month = date.getMonth() + 1; // Adding 1 because months are zero-based
	var day = date.getDate();
	var hours = date.getHours();
	var minutes = date.getMinutes();
	var seconds = date.getSeconds();
	var formattedDateTime = pad(hours) + ':' + pad(minutes);
	return formattedDateTime;
};

function pad(number) {
	return (number < 10 ? '0' : '') + number;
}

const removeTempElements = () => {
	const tempElements = document.querySelectorAll('.temp-element');
	tempElements.forEach(function (element) {
		element.remove();
	});
};

///////////////////////////////////// PRINT FUNCTIONS /////////////////////////////////////

const printBotMessage = (message) => {
	let botMessageTimestamp = Date.now();
	addMessageToHistory('bot', message, botMessageTimestamp);
	removeTempElements();
	const newLine = document.createElement('li');
	newLine.classList.add('bot-line', 'conversation-line');
	newLine.innerHTML = `
	 				<div class="avatar-icon">
                        <img id="bot-avatar" height="35px" width="35px" src="${RC_botAvatarSrc}" alt="RoboChat avatar" />
                    </div>
                    <div class="conv-text bot-text">
                        <span>${message}</span>
                    </div>`;
	conversation.appendChild(newLine);
	const newTime = document.createElement('div');
	newTime.classList.add('bot-time');
	newTime.innerHTML = `<span>${readTimestamp(botMessageTimestamp)}</span>`;
	conversation.appendChild(newTime);
	chatSection.scrollTop = chatSection.scrollHeight;
};

const printBotError = (message) => {
	removeTempElements();
	const newLine = document.createElement('li');
	newLine.classList.add('bot-line', 'conversation-line', 'temp-element');
	newLine.innerHTML = `
					<div class="avatar-icon">
            	        <img id="bot-avatar" height="35px" width="35px" src="${RC_botAvatarSrc}" alt="RoboChat avatar" />
                    </div>
                    <div class="conv-text bot-text">
                        <span style="color: red">${message}</span>
                    </div>`;
	conversation.appendChild(newLine);
	chatSection.scrollTop = chatSection.scrollHeight;
};

const printSpacer = () => {
	const spacer = document.createElement('li');
	spacer.classList.add('temp-element', 'spacer');
	spacer.style.minHeight = '10px';
	conversation.appendChild(spacer);
	chatSection.scrollTop = chatSection.scrollHeight;
};

const printBotBusyIndicator = () => {
	const newLine = document.createElement('li');
	newLine.classList.add('bot-line', 'conversation-line', 'temp-element');
	newLine.innerHTML = `
	 				<div class="avatar-icon">
                        <img id="bot-avatar" height="35px" width="35px" src="${RC_botAvatarSrc}" alt="RoboChat avatar" />
                    </div>
                    <div class="conv-text bot-text">
                        <span class="dot"></span>
  						<span class="dot"></span>
  						<span class="dot"></span>
                    </div>
	`;
	conversation.appendChild(newLine);
	chatSection.scrollTop = chatSection.scrollHeight;
};

const printUserMessage = (message) => {
	let userMessageTimestamp = Date.now();
	addMessageToHistory('user', message, userMessageTimestamp);
	removeTempElements();
	const newLine = document.createElement('li');
	newLine.classList.add('user-line', 'conversation-line');
	newLine.innerHTML = `
                    <div class="conv-text user-text">
                        <span>${message}</span>
                    </div>
					<div class="avatar-icon">
                        <img id="user-avatar" height="35px" width="35px" src="${RC_userAvatarSrc}" alt="user avatar" />
                    </div>
	`;
	conversation.appendChild(newLine);
	const newTime = document.createElement('div');
	newTime.classList.add('user-time');
	newTime.innerHTML = `<span>${readTimestamp(userMessageTimestamp)}</span>`;
	conversation.appendChild(newTime);
	chatSection.scrollTop = chatSection.scrollHeight;
};

////////////////////////////////// CONVERSATION FUNCTIONS /////////////////////////////////

const initializeConvo = () => {
	// Get the query string portion of the URL
	const queryString = window.location.search;

	// Parse the query string into key-value pairs
	const searchParams = new URLSearchParams(queryString);

	// Get the value of a specific parameter
	const paramValue = searchParams.get('botId');

	printBotMessage('botId: ' + paramValue);
	printBotMessage(RC_firstBotMessage);
	askUserToAnswer();
};

const askUserToAnswer = () => {
	removeTempElements();
	printSpacer();
	userInputText.placeholder = RC_userInputTextPlaceholder;
	userInputText.removeAttribute('disabled');
	addUserListeners();
	userInputText.focus();
};

const handleUserInput = () => {
	if (userInputText.value === '') {
		printBotError(RC_noEntryBotMessage);
	} else {
		let userMessageTimestamp = Date.now();
		printUserMessage(userInputText.value, userMessageTimestamp);
		removeUserListeners();
		let userText = userInputText.value;
		userInputText.value = '';
		userInputText.placeholder = 'Please Wait';
		userInputText.setAttribute('disabled', 'disabled');
		askBotToAnswer(userText);
	}
};

const askBotToAnswer = (userText) => {
	printBotBusyIndicator();
	requestBotInput(userText)
		.then((response) => {
			handleBotInput(response);
		})
		.catch((error) => {
			printBotError(RC_botErrorMessage);
			console.error(error);
		});
};

const handleBotInput = (botText) => {
	addMessageToHistory('bot-full', botText, 0);

	const messagesToPrint = splitLongText(botText);
	const numberOfMessages = messagesToPrint.length;
	let index = 0;

	const printMessageWithDelay = () => {
		printBotMessage(messagesToPrint[index]);
		if (index + 1 < numberOfMessages) {
			printBotBusyIndicator();
			const currentMessageLength = messagesToPrint[index].length;
			index++;
			const nextMessageLength = messagesToPrint[index].length;
			const timeout = (currentMessageLength * 1 + nextMessageLength * 5) * 1.5 + 1000;
			setTimeout(printMessageWithDelay, timeout);
		} else {
			askUserToAnswer();
		}
	};

	printMessageWithDelay();
};

////////////////////////////////////// SERVER REQUEST /////////////////////////////////////

const requestBotInput = (text) => {
	return new Promise((resolve, reject) => {
		var xhr = new XMLHttpRequest();
		xhr.open('POST', 'https://robochat.pro/answer.php', true); // https://robo-chat.ro/test2.php
		xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');

		xhr.onload = function () {
			if (xhr.status === 200) {
				resolve(xhr.responseText);
			} else {
				reject(new Error('Request failed with status: ' + xhr.status));
			}
		};

		xhr.onerror = function () {
			reject(new Error('Request failed'));
		};

		const url = window.location.href;

		xhr.send('text=' + encodeURIComponent(text) + '&url=' + encodeURIComponent(url) + '&botID=' + botID);
	});
};

///////////////////////////////////// EVENT LISTENERS /////////////////////////////////////

function handleKeyPress(event) {
	if (event.key === 'Enter') {
		handleUserInput();
	}
}

const addUserListeners = () => {
	userInputButton.addEventListener('click', handleUserInput);
	userInputText.addEventListener('keydown', handleKeyPress);
};

const removeUserListeners = () => {
	userInputButton.removeEventListener('click', handleUserInput);
	userInputText.removeEventListener('keydown', handleKeyPress);
};

downloadButton.addEventListener('click', downloadConvo);

///////////////////////////////////// EXECUTABLE CODE /////////////////////////////////////

initializeConvo();
