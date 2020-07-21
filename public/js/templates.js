(() => {
    /**
     * Templates for populating UI
     * 
     * Template Object which has a blueprint and placeholder map
     * @typedef {Object} Template
     * @property {string} blueprint
     * @property {Object} placeholders
     */
    const templates = {
        /**
         * @param {Template} template
         */
        compile: (template) => {
            let compiledTemplate = template.blueprint;
            Object.keys(template.placeholders).forEach(key => {
                let replaceKey = new RegExp(`#${key}#`, 'g');
                compiledTemplate = compiledTemplate.replace(replaceKey, template.placeholders[key]);
            });
            const compiledDiv = document.createElement('div');
            compiledDiv.innerHTML = compiledTemplate;
            return compiledDiv.children[0];
        },
        /**
         * creates an element and returns it
         * 
         * @param {string} [elName] If not provided, div will be created
         * @param {string} [classNameList] IF provided will be added to the class list. It could be a space seperated list of values
         * like 'example-class-1 example-class-2'
         */
        createEl: (elName, classNameList) => {
            let el;
            el = elName ? document.createElement(elName) : document.createElement('div');
            el.classList = classNameList ? classNameList : '';
            return el;
        },
        DASHBOARD_CARD: {
            blueprint: `
                <div class="py-8 px-4 dashboardCard" id="#mainId#">
                    <div class="h-full flex items-start">
                        <div class="w-12 flex-shrink-0 flex flex-col text-center leading-none pt-3">
                            <span class="text-gray-500 pb-2 mb-2 border-b-2 border-gray-200">Qn</span>
                            <span class="font-medium text-xl text-gray-800 title-font">#qnNo#</span>
                        </div>
                        <div class="flex-grow px-6 py-3 bg-gray-100 rounded dashboardContent">
                            <h1 class="title-font text-xl font-medium text-gray-900 mb-1">#qn#</h1>
                            <h2 class="tracking-widest text-xs title-font font-medium text-indigo-500 mb-1">#noOfReplies# Replies</h2>
                            <div class="leading-relaxed mb-5" id="#cardId#">
                            </div>
                        </div>
                    </div>
                </div>
            `,
            placeholders: {
                qnNo: '',
                noOfReplies: '',
                qn: '',
                cardId: '',
                mainId: ''
            }
        },
        FEEDBACK_PILL: {
            blueprint: `
            <div class="inline-block mr-1 mt-1 #pillclass# px-3 py-2 rounded-full text-white text-xs md:text-base">
                <span class="font-medium mr-3">#option# →</span>
                <span>#count#</span>
            </div>
            `,
            placeholders: {
                option: '',
                count: '',
                pillclass: ''
            }
        },
        BAR_GRAPH: {
            blueprint: `
                <div class="rounded-r-full mt-1 text-xs px-2 py-1 text-center #color# text-gray-900" style="width:#width#%"></div>
            `,
            placeholders: {
                color: '',
                width: ''
            }
        },
        SURVEY_CARD: {
            blueprint: `
            <div class="p-4 lg:w-1/3 w-full relative md:w-1/2 xl:w-1/4" id="survey#surveyno#" copied="false">
                <div class="h-full bg-gray-200 hover:bg-gray-200 px-8 pt-16 pb-24 rounded-lg overflow-hidden text-center relative">
                    <h2 class="tracking-widest text-xs title-font font-medium text-gray-500 mb-1">SURVEY</h2>
                    <h1 class="title-font sm:text-2xl text-xl font-medium text-gray-900 mb-3">#title#</h1>
                    <a class="text-indigo-500 inline-flex items-center cursor-pointer" href="/edit?id=#id#">Edit Survey
                        <svg class="w-4 h-4 ml-2" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M5 12h14"></path>
                            <path d="M12 5l7 7-7 7"></path>
                        </svg>
                    </a>
                    <div class="text-center mt-2 leading-none flex justify-center absolute bottom-0 left-0 w-full py-4">
                        <a target="_blank" href="/feedback?id=#formurl#" class="hover:bg-gray-500 hover:text-white rounded transition duration-300 text-gray-600 inline-flex items-center leading-none text-sm px-3 py-2 border-r-2 border-gray-300">
                            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>Preview
                        </a>
                        <a href="/dashboard?id=#id#" class="hover:bg-gray-500 hover:text-white rounded transition duration-300 text-gray-600 inline-flex items-center leading-none text-sm px-3 py-2 border-r-2 border-gray-300">
                            <svg class="w-4 h-4 mr-1" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" viewBox="0 0 24 24">
                                <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z"></path>
                            </svg>#noOfReplies# Replies
                        </a>
                        <a onclick="copyLink('/feedback?id=#formurl#', 'survey#surveyno#')" class="hover:bg-gray-500 hover:text-white rounded transition duration-300 text-gray-600 inline-flex items-center leading-none text-sm px-3 py-2 cursor-pointer">
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 mr-1" viewBox="0 0 24 24">
                                <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                            </svg>Share
                        </a>
                    </div>
                </div>
            </div>
            `,
            placeholders: {
                surveyno: '',
                id: '',
                formurl: '',
                title: '',
                noOfReplies: ''
            }
        },
        EDIT_SURVEY_CARD: {
            blueprint: `
            <div class="w-full p-4" id="QnNo#qnNo#">
                <div class="border border-gray-300 rounded flex">
                <div class="p-2 bg-gray-100 flex-shrink-0">#qnNo#</div>
                <div class="flex-grow">
                    <div survey-qn-statement-for="#qnNo#" class="border-b py-2 font-medium px-4 focus:outline-none" contenteditable="true" id="QnNo#qnNo#Statement">
                        #qnContent#
                    </div>
                    <div class="p-4 border-b">
                    <div class="flex mb-3">
                        <div class="flex-grow py-2 px-5 bg-gray-200 cursor-pointer rounded-lg capitalize" onclick="showModal('editTypeModal', '#qnNo#')">#answerType#</div>
                    </div>
                    <div class="mb-2 #surveyQnOptionsHidden#">
                        <div class="tracking-wider mb-2 text-xs ml-2 font-medium">Options</div>
                        <div class="flex flex-wrap" id="surveyQnOptionHolder#id#">
                            
                        </div>
                    </div>
                    </div>
                    <div class="p-3 flex">
                    <div class="w-full text-right py-2">
                        <span class="mr-2 py-2 px-3 bg-red-500 rounded-lg text-white cursor-pointer" onclick="deleteSurveyQn(#qnNo#)">Delete</span>
                        <span class="mr-2 py-2 px-3 bg-gray-300 rounded-lg cursor-pointer" onclick="copySurveyQn(#qnNo#)">Copy</span>
                        <label for="reqd_validation">
                        Required
                        <input id="reqd_validation" type="checkbox" value="true" class="apple-switch align-text-bottom" #requireValidation# onchange="changeReqdValidation('#qnNo#', this)">
                        </label>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            `,
            placeholders: {
                qnNo: '',
                qnContent: '',
                answerType: 'Chose The Answer Type',
                id: '',
                surveyQnOptionsHidden: 'hidden',
                requireValidation: 'checked'
            }
        },
        EDIT_SURVEY_CARD_OPTION_PILL: {
            blueprint: `
            <div class="px-4 py-1 bg-gray-200 rounded-full mr-3 mb-4 font-medium">
                #optn#
                <span class="ml-1 py-1 px-1 text-red-600 text-white cursor-pointer text-s align-bottom" onclick="deleteOption('#qnId#','#optnId#')">x</span>
            </div>
            `,
            placeholders: {
                optn: '',
                optnId: '',
                qnId: ''
            }
        },
        ADD_OPTION_PILL: {
            blueprint: `
            <div class="px-4 py-1 bg-gray-200 rounded-full mr-3 mb-4 font-medium cursor-pointer" onclick="showModal('addOptionModal', '#id#')">Add +</div>
            `,
            placeholders: {}
        }
    }

    window.Templates = templates;
})();

