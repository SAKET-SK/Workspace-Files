'use strict';

/**
 * Set client auth mode - true to enable client auth, false to disable it.
 *
 * Disabling authentication is preferred for initial integration of the SDK with the web app.
 *
 * When client authentication has been disabled, only connections made from unblocked lists (allowed domains) are
 * allowed at the server. This use case is recommended when the client application cannot generate a signed JWT (because
 * of a static website or no authentication mechanism for the web/mobile app) but requires ODA integration. It can also
 * be used when the chat widget is already secured and visible to only authenticated users in the client platforms (web
 * application with the protected page).
 *
 * For other cases, it is recommended that client auth enabled mode is used when using the SDK for production as it adds
 * another layer of security when connecting to a DA/skill.
 *
 * When client authentication has been enabled, client authentication is enforced by signed JWT tokens in addition to
 * the unblocked lists. When the SDK needs to establish a connection with the ODA server, it first requests a JWT token
 * from the client and then sends it along with the connection request. The ODA server validates the token signature and
 * obtains the claim set from the JWT payload to verify the token to establish the connection.
 *
 * The Web channel in ODA must also be enabled to accept client auth enabled connections.
 */
let isClientAuthEnabled = false;

/**
 * Initializes the SDK and sets a global field with passed name for it the can
 * be referred later
 *
 * @param {string} name Name by which the chat widget should be referred
 */
function initSdk(name) {
    // Retry initialization later if the web page hasn't finished loading or the WebSDK is not available yet
    if (!document || !document.body || !WebSDK) {
        setTimeout(function () {
            initSdk(name);
        }, 2000);
        return;
    }

    if (!name) {
        name = 'Bots';          // Set default reference name to 'Bots'
    }

    let Bots;

    /**
     * SDK configuration settings
     *
     * Other than URI, all fields are optional with two exceptions for auth modes:
     *
     * In client auth disabled mode, 'channelId' must be passed, 'userId' is optional
     * In client auth enabled mode, 'clientAuthEnabled: true' must be passed
     */
    const chatWidgetSettings = {
        URI: 'https://idcs-oda-683ca4eec78e4cf09713279c1c8ed58b-s0.data.digitalassistant.oci.oc-test.com/',                               // ODA URI, only the hostname part should be passed, without the https://
        clientAuthEnabled: isClientAuthEnabled,     // Enables client auth enabled mode of connection if set true, no need to pass if set false
        channelId: 'a092e1e4-66ff-4cc5-9232-e040b9331bb1',  // Channel ID, available in channel settings in ODA UI, optional if client auth enabled
        userId: '<userID>',                         // User ID, optional field to personalize user experience
        enableAutocomplete: true,                   // Enables autocomplete suggestions on user input
        enableBotAudioResponse: true,               // Enables audio utterance of skill responses
        enableClearMessage: true,                   // Enables display of button to clear conversation
        enableSpeech: true,                         // Enables voice recognition
        showConnectionStatus: true,                 // Displays current connection status on the header
        i18n: {                                     // Provide translations for the strings used in the widget
            en: {                                   // en locale, can be configured for any locale
                chatTitle: 'Mr.Loco',      // Set title at chat header
                chatSubtitle: "Your Train Journey helper"       
            }
        },
        timestampMode: 'relative',                  // Sets the timestamp mode, relative to current time or default (absolute)
        theme: WebSDK.THEME.DEFAULT,                // Redwood dark theme. The default is THEME.DEFAULT, while older theme is available as THEME.CLASSIC
        icons: {
            logo: "https://thumbs.dreamstime.com/b/train-conductor-cartoon-face-glasses-vector-illustration-120285123.jpg",
            avatarAgent: "https://png.pngtree.com/element_our/20190531/ourmid/pngtree-anime-thick-painted-train-conductor-illustration-image_1302667.jpg",
            avatarUser: '<svg xmlns="http://www.w3.org/2000/svg" height="32" width="32"><path fill="black" d="M12 2c5.523 0 10 4.477 10 10a9.982 9.982 0 01-3.804 7.85L18 20a9.952 9.952 0 01-6 2C6.477 22 2 17.523 2 12S6.477 2 12 2zm2 16h-4a2 2 0 00-1.766 1.06c1.123.6 2.405.94 3.766.94s2.643-.34 3.765-.94a1.997 1.997 0 00-1.616-1.055zM12 4a8 8 0 00-5.404 13.9A3.996 3.996 0 019.8 16.004L10 16h4c1.438 0 2.7.76 3.404 1.899A8 8 0 0012 4zm0 2c2.206 0 4 1.794 4 4s-1.794 4-4 4-4-1.794-4-4 1.794-4 4-4zm0 2c-1.103 0-2 .897-2 2s.897 2 2 2 2-.897 2-2-.897-2-2-2z" fill="#100f0e" fill-rule="evenodd"/></svg>',
            avatarBot: "https://png.pngtree.com/element_our/20190531/ourmid/pngtree-anime-thick-painted-train-conductor-illustration-image_1302667.jpg",
            launch: "https://thumbs.dreamstime.com/b/train-conductor-cartoon-face-glasses-vector-illustration-120285123.jpg"
        }
    };

    // Enable custom rendering for cards, Make it `true` to enable custom rendering demo
    let enableCustomCards = false;

    if (enableCustomCards) {
        chatWidgetSettings.delegate = {
            render: (message) => {
                if (message.messagePayload.type === "card") {
                    const msgElem = document.getElementById(message.msgId);
                    // Create custom styles
                    const styles = `
                        .custom-card {
                            background-color: white;
                            width: 100%;
                            max-width: 100%;
                            border-radius: 10px;
                            margin: 2px 0 0;
                        }
                        
                        .custom-card ul {
                            list-style: none;
                            padding: 0;
                            margin: 0;
                        }
                        
                        .custom-card li {
                            display: flex;
                            justify-content: space-between;
                            padding: 10px;
                            border-bottom: thin solid #f5f4f2;
                        }
                        
                        .custom-card li:last-child {
                            border-bottom: none;
                        }
                        
                        .custom-card button {
                            align-self: start;
                        }
                        
                        .actions-wrapper {
                            margin-top: 8px;
                        }`;

                    // Create custom template
                    const styleElem = document.createElement('style');
                    styleElem.innerText = styles;
                    document.head.appendChild(styleElem);

                    const cardElem = document.createElement('div');
                    cardElem.classList.add('custom-card');
                    const cardList = document.createElement('ul');
                    const cards = message.messagePayload.cards;
                    cards.forEach(card => {
                        const liElem = document.createElement('li');
                        const titleElem = document.createElement('div');
                        titleElem.innerText = card.title;
                        liElem.appendChild(titleElem);
                        const button = document.createElement('button');
                        button.innerText = card.actions[0].label;
                        button.addEventListener('click', () => {
                            actionHandler(card.actions[0]);
                        });
                        liElem.appendChild(button);
                        cardList.appendChild(liElem);
                    });
                    cardElem.appendChild(cardList);
                    msgElem.appendChild(cardElem);

                    const actions = message.messagePayload.actions;
                    const actionsElem = document.createElement('div');
                    actionsElem.classList.add('actions-wrapper');
                    if (actions && actions.length) {
                        actions.forEach(action => {
                            const button = document.createElement('button');
                            button.innerText = action.label;
                            actionsElem.appendChild(button);
                            button.addEventListener('click', () => {
                                actionHandler(action);
                            });
                        });
                    }
                    msgElem.appendChild(actionsElem);
                    // Return `true` for customizing rendering for cards
                    return true;
                }
                // Return `false` for all other payloads to continue with WebSDK rendering
                return false;
            }
        }
    }

    // Initialize SDK
    if (isClientAuthEnabled) {
        Bots = new WebSDK(chatWidgetSettings, generateToken);
    } else {
        Bots = new WebSDK(chatWidgetSettings);
    }

    // Connect to skill when the widget is expanded for the first time
    let isFirstConnection = true;

    Bots.on(WebSDK.EVENT.WIDGET_OPENED, function () {
        if (isFirstConnection) {
            Bots.connect();

            isFirstConnection = false;
        }
    });

    function actionHandler(action) {
        Bots.sendMessage(action);
    }

    // Create global object to refer Bots
    window[name] = Bots;
}

/**
 * Function to generate JWT tokens. It returns a Promise to provide tokens.
 * The function is passed to SDK which uses it to fetch token whenever it needs
 * to establish connections to chat server
 *
 * @returns {Promise} Promise to provide a signed JWT token
 */
function generateToken() {
    return new Promise(function (resolve) {
        mockApiCall('https://mockurl').then(function (token) {
            resolve(token);
        });
    });
}

/**
 * A function mocking an endpoint call to backend to provide authentication token
 * The recommended behaviour is fetching the token from backend server
 *
 * @returns {Promise} Promise to provide a signed JWT token
 */
function mockApiCall() {
    return new Promise(function (resolve) {
        setTimeout(function () {
            const now = Math.floor(Date.now() / 1000);
            const payload = {
                iat: now,
                exp: now + 3600,
                channelId: 'a092e1e4-66ff-4cc5-9232-e040b9331bb1',
                userId: '<userID>'
            };
            const SECRET = 'MnhSupnRzGHfunm9J2uo6x8pPFt4jAZt';

            // An unimplemented function generating signed JWT token with given header, payload, and signature
            const token = generateJWTToken({ alg: 'HS256', typ: 'JWT' }, payload, SECRET);
            resolve(token);
        }, Math.floor(Math.random() * 1000) + 1000);
    });
}

/**
 * Unimplemented function to generate signed JWT token. Should be replaced with
 * actual method to generate the token on the server.
 *
 * @param {object} header
 * @param {object} payload
 * @param {string} signature
 */
function generateJWTToken(header, payload, signature) {
    throw new Error('Method not implemented.');
}

// My JS Function
const form = document.getElementById("bookingForm");
const travelType = document.getElementById("travelType");
const dateInput = document.getElementById("date");
const genderInput = document.getElementById("gender");
const dateErrorMessage = document.getElementById("dateErrorMessage");
const genderErrorMessage = document.getElementById("genderErrorMessage");

const marqueeTexts = [
    "Did you know : Indian Railways is the fourth-largest railway network in the world, covering over 67,000 route kilometers and serving millions of passengers daily.",
    "Did you know : Gorakhpur Junction in Uttar Pradesh has the longest railway platform in the world, spanning approximately 1,366.33 meters.",
    "Did you know : The Delhi-Howrah route is one of the busiest railway routes globally, connecting the capital city, New Delhi, to Kolkata.",
    "Did you know : The Fairy Queen, a steam locomotive built in 1855, is one of the oldest operating steam engines in the world. It was awarded a Guinness World Record in 1998 for its heritage status.",
    "Did you know : The Darjeeling Himalayan Railway also known as the TOY TRAIN, this narrow-gauge railway in West Bengal is a UNESCO World Heritage Site and provides breathtaking views of the Himalayas.",
    "Did you know : The Palace on Wheels is a luxury tourist train offers a royal experience, taking passengers on a week-long journey through Rajasthan, showcasing the state's rich history and culture.",
    "Did you know : Indian Railways introduced Vistadome coaches with panoramic windows, offering passengers stunning views of scenic routes like the Araku Valley in Andhra Pradesh and the Nilgiri Mountain Railway in Tamil Nadu.",
    "Did you know : In 2020, the Ambala Cantt railway station in Haryana was awarded the title of the cleanest railway station in India.",
    "Did you know : Indian Railways has one of the largest fleets of electric locomotives globally, contributing to a reduction in greenhouse gas emissions.",
    "Did you know : In 2018, Indian Railways set a world record when 800 railway employees cleaned a single train in under 5 minutes.",
    "Did you know : The Kalka-Shimla Railway, this narrow-gauge railway in Himachal Pradesh is another UNESCO World Heritage Site and is famous for its winding tracks through picturesque hills.",
    "Did you know : Often referred to as the LIFELINE OF INDIA, the Indian Railways plays a crucial role in transporting goods and people across the vast and diverse country.",
    "Did you know : IRCTC is one of the largest e-commerce websites in Asia, handling online ticketing, catering, and tourism services for Indian Railways.",
    "Did you know : The Rajdhani Express is series of premium, high-speed trains connects major cities in India, providing passengers with comfort and efficiency for long-distance travel.",
    "Did you know : Apart from the Palace on Wheels, India also offers other luxury trains like the Maharajas' Express, the Deccan Odyssey, and the Golden Chariot, providing travelers with opulent experiences."
];
        
function getRandomMarqueeText() {
    const randomIndex = Math.floor(Math.random() * marqueeTexts.length);
    return marqueeTexts[randomIndex];
}

window.addEventListener('load', () => {
    const marquee = document.getElementById('marquee-text');
    marquee.textContent = getRandomMarqueeText();
});

form.addEventListener("submit", function (e) {
    if (travelType.value === "tatkal") {
        const selectedDate = new Date(dateInput.value);
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);

        if (selectedDate.getTime() !== tomorrow.getTime()) {
            e.preventDefault();
            dateErrorMessage.style.display = "block";
        } else {
            dateErrorMessage.style.display = "none";
        }
    } else {
        dateErrorMessage.style.display = "none";
    }

    if (travelType.value === "ladies" && genderInput.value !== "female") {
        e.preventDefault();
        genderErrorMessage.style.display = "block";
    } else {
        genderErrorMessage.style.display = "none";
    }
});

travelType.addEventListener("change", function () {
    if (travelType.value === "tatkal") {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateInput.min = tomorrow.toISOString().split("T")[0];
        dateInput.max = tomorrow.toISOString().split("T")[0];
    } else {
        dateInput.min = "";
        dateInput.max = "";
    }

    if (travelType.value === "ladies") {
        genderInput.value = "female";
        genderInput.disabled = true;
    } else {
        genderInput.disabled = false;
    }
});