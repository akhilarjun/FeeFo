const loaderPage = document.getElementById('loader_page');
let feedbackForID, deleteSurveyQn, copySurveyQn, choseSurveyAnswerType, windowScrollingFn = () => { }, addOption, cancelOption, deleteOption, errorObj = {};

errorObj.status = 'Oh!';
errorObj.statusText = 'Sorry about this';

if (!isBrowserOld()) {
    console.info('Yipee! you have a awesome new browser!');
    if (get_browser().name.toLowerCase().trim() === 'chrome') {
        document.querySelector('body').setAttribute('browser', 'chrome');
    }
}

const theme = localStorage.getItem('theme');
if (theme == 'light') {
    document.getElementById('theme-holder-menu').dataset.theme = 'dark';
    document.getElementById('theme-holder-menu').textContent = 'Dark Theme';
} else {
    document.getElementById('theme-holder-menu').dataset.theme = 'light';
    document.getElementById('theme-holder-menu').textContent = 'Light Theme';
}

const togglemenu = (overrirde) => {
    const sign_out_drawer = document.getElementById('sign-out-drawer');
    let classList = sign_out_drawer.classList;
    if (classList.contains('show') || overrirde) {
        classList = (classList + '').replace(/ show/g, '');
    } else {
        classList += ' show';
    }
    sign_out_drawer.classList = classList;
}

document.querySelector('body').addEventListener('click', (e) => {
    const el1 = document.getElementById('menu-wrapper-main');
    const el2 = document.getElementById('sign-out-btn');
    const el3 = document.querySelector('#sign-out-btn span');
    const el4 = document.querySelector('#sign-out-btn img');
    switch (e.target) {
        case el1:
        case el2:
        case el3:
        case el4:
            break;
        default:
            togglemenu(true);
    }
});

const setLabelForTheme = () => {

}

const showLoader = () => {
    loaderPage.classList = (loaderPage.classList + '').replace('fade-out', '');
    loaderPage.style.display = 'block';
}

const hideLoader = () => {
    if ((loaderPage.classList + '').indexOf('fade-out') === -1) {
        loaderPage.classList = loaderPage.classList + ' fade-out';
        setTimeout(() => {
            loaderPage.style.display = 'none';
        }, 1000);
    }
}

const isInViewport = function (elem) {
    var bounding = elem.getBoundingClientRect();
    return (
        bounding.top >= 0 &&
        bounding.left >= 0 &&
        bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        bounding.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

const paintMosaic = () => {
    const gridWrapper = document.getElementById('dashboard_card_holder');
    if (gridWrapper) {
        console.info('Painting Mosaic for you!');
        const rowHeight = parseInt(window.getComputedStyle(gridWrapper).getPropertyValue('grid-auto-rows'));
        const gapHeight = parseInt(window.getComputedStyle(gridWrapper).getPropertyValue('gap'));
        document.querySelectorAll('.dashboardCard').forEach(item => {
            const rowSpan = Math.ceil((item.querySelector('.dashboardContent').getBoundingClientRect().height + gapHeight) / (rowHeight + gapHeight));
            item.style.gridRowEnd = 'span ' + rowSpan;
        });
    }
}

const checkForErrors = (res) => {
    if (!res.ok) {
        errorObj.status = res.status;
        errorObj.statusText = res.statusText;
        $Router.hash('error');
        // throw Error("Error 401");
    }
    return res;
}

const paintEditForm = (qnsList, surveyQnHolder) => {
    surveyQnHolder.innerHTML = '';
    qnsList.forEach((qn, i) => {
        const id = 'surveyQnFor' + i;
        const survyQnCrdTemplate = Templates.EDIT_SURVEY_CARD;
        survyQnCrdTemplate.placeholders.qnContent = qn.statement;
        survyQnCrdTemplate.placeholders.answerType = qn.type;
        survyQnCrdTemplate.placeholders.id = id;
        survyQnCrdTemplate.placeholders.qnNo = i + 1;
        if (qn.type != 'text') {
            survyQnCrdTemplate.placeholders.surveyQnOptionsHidden = '';
        } else {
            survyQnCrdTemplate.placeholders.surveyQnOptionsHidden = 'hidden';
        }
        if (qn.requireValidation) {
            survyQnCrdTemplate.placeholders.requireValidation = 'checked';
        } else {
            survyQnCrdTemplate.placeholders.requireValidation = '';
        }
        const surveyQnCard = Templates.compile(survyQnCrdTemplate);
        if (qn.type != 'text') {
            qn.optionsList.forEach((option, optionIndex) => {
                const pillTemplate = Templates.EDIT_SURVEY_CARD_OPTION_PILL;
                pillTemplate.placeholders.optn = option;
                pillTemplate.placeholders.optnId = optionIndex;
                pillTemplate.placeholders.qnId = i;
                surveyQnCard.querySelector('#surveyQnOptionHolder' + id).append(Templates.compile(pillTemplate));
            });
            const addOptionPill = Templates.ADD_OPTION_PILL;
            addOptionPill.placeholders.id = i;
            surveyQnCard.querySelector('#surveyQnOptionHolder' + id).append(Templates.compile(addOptionPill));
        }
        surveyQnHolder.append(surveyQnCard);
    });
    populateSurveyQnStatement()
}

const showModal = (id, actionFor) => {
    document.getElementById(id).style.display = 'flex';
    document.getElementById(id).dataset.actionFor = actionFor;
    let firstInputInModal = document.getElementById(id).querySelector('input');
    firstInputInModal && firstInputInModal.focus();
}

const closeModal = (id) => {
    document.getElementById(id).style.display = 'none';
    document.getElementById(id).dataset.actionFor = '';

}

const copyLink = (link, id) => {
    const toCopy = `${location.protocol}//${location.host}${link}`;
    let input = document.createElement('input');
    input.value = toCopy;
    document.querySelector('body').appendChild(input);
    input.select();
    document.execCommand('copy');
    document.querySelector('body').removeChild(input);
    document.getElementById(id).setAttribute('copied', 'true');
    setTimeout(() => {
        document.getElementById(id).setAttribute('copied', 'false');
    }, 1000);
}

window.addEventListener("resize", paintMosaic);

const fetchFeedbackId = () => {
    const currentURI = window.location.href;
    let url = new URL(currentURI);
    feedbackForID = url.searchParams.get('id');
}

$Router.config([
    { path: 'home', templateUrl: 'partial/home.html' },
    { path: 'feedback', templateUrl: 'partial/feedback.html' },
    { path: 'dashboard', templateUrl: 'partial/dashboard.html' },
    { path: 'thank-you', templateUrl: 'partial/thankyou.html' },
    { path: 'surveys', templateUrl: 'partial/surveys.html' },
    { path: 'edit', templateUrl: 'partial/edit.html' },
    { path: 'error', templateUrl: 'partial/error.html' },
    { otherwise: 'home' }
], {
    activateLinks: false,
    defaultLinkClass: 'mr-5 hover:text-gray-900 nav',
    onRouteChangeError: () => {
        hideLoader();
    },
    beforeRouteChange: () => {
        //checkUserSignedIn();
        fetchFeedbackId();
        showLoader();
        windowScrollingFn = () => { }
        window.onscroll = windowScrollingFn;
    },
    afterRouteChange: (ap) => {
        document.querySelectorAll('a.nav').forEach(a => {
            a.classList = (a.classList + '').replace('active', '');
        });
        let activeLink = document.querySelector('a[href="#' + ap + '"]');
        activeLink && (activeLink.classList += ' active');

        if (ap === 'home') {
            document.title = 'FeeFo | Feedbacks made simple';
            const goToSurveys = () => {
                console.log('hey');
            }
            hideLoader();
        }

        if (ap === 'error') {
            document.title = 'Error : ' + errorObj.statusText + ' | Feefo';
            document.getElementById('error-status').textContent = errorObj.status;
            document.getElementById('error-status-text').textContent = errorObj.statusText;
            hideLoader();
        }

        if (ap === 'surveys') {
            const surveyContainer = document.getElementById('survey-container');
            let surveyList;
            document.getElementById('autoComplete_Search').addEventListener('keyup', (e) => {
                const searchQuery = e.target.value;
                surveyList.forEach((survey, i) => {
                    if (survey.name.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1 && searchQuery.length > 2) {
                        document.getElementById(`survey${i + 1}`).style.display = 'none';
                    } else {
                        document.getElementById(`survey${i + 1}`).style.display = 'block';
                    }
                });
            });

            // fetch('/getconfig').then(checkForErrors).then(res => {
            fetch('/survey').then(checkForErrors).then(res => {
                return res.json();
            }).then(res => {
                surveyList = res;
                surveyList.forEach((survey, i) => {
                    const SURVEY_CARD = Templates.SURVEY_CARD;
                    SURVEY_CARD.placeholders.title = survey.name;
                    SURVEY_CARD.placeholders.noOfReplies = survey.replyCount;
                    SURVEY_CARD.placeholders.id = survey._id;
                    SURVEY_CARD.placeholders.formurl = survey.sharableURL;
                    SURVEY_CARD.placeholders.surveyno = i + 1;
                    surveyContainer.append(Templates.compile(SURVEY_CARD));
                });
                hideLoader();
            }).catch(err => {
                console.log(err);
            });
        }

        if (ap === 'edit') {

            windowScrollingFn = () => {
                if (!isInViewport(document.getElementById('footer-up'))) {
                    document.getElementById('footer-edit-survey').classList = 'sticky-footer';
                } else {
                    document.getElementById('footer-edit-survey').classList = '';
                }
            }
            window.onscroll = windowScrollingFn;

            const surveyQnHolder = document.getElementById('edit_survey_qns');
            let qnsList, surveyForm = {}, existingSurvey = false;

            const populateSurveyName = () => {
                const value = document.getElementById('edit_survey_name').textContent;
                document.getElementById('survey_name').textContent = value;
                surveyForm.name = value;
            }

            populateSurveyQnStatement = () => {
                document.querySelectorAll('[survey-qn-statement-for]').forEach((el, index) => {
                    let pushValue = (e) => {
                        let questionNum = e.target.getAttribute('survey-qn-statement-for');
                        qnsList[Number(questionNum) - 1].statement = e.target.textContent;
                    }
                    el.addEventListener('blur', pushValue)
                    el.addEventListener('keyup', pushValue)
                })
            }

            document.getElementById('edit_survey_name').addEventListener('keyup', populateSurveyName);
            document.getElementById('edit_survey_name').addEventListener('blur', populateSurveyName);

            deleteSurveyQn = (num) => {
                qnsList.splice(num - 1, 1);
                paintEditForm(qnsList, surveyQnHolder);
            }

            copySurveyQn = (num) => {
                const toCopyQn = Array.from(qnsList)[num - 1];
                const copiedQn = JSON.parse(JSON.stringify(toCopyQn));
                qnsList.push(copiedQn);
                paintEditForm(qnsList, surveyQnHolder);
            }

            choseSurveyAnswerType = (type) => {
                const qnNo = document.getElementById('editTypeModal').dataset.actionFor;
                qnsList[Number(qnNo) - 1].type = type;
                if (type === 'text') {
                    qnsList[Number(qnNo) - 1].optionsList = [];
                }
                paintEditForm(qnsList, surveyQnHolder);
                closeModal('editTypeModal');
            }

            addOption = () => {
                const qnNo = document.getElementById('addOptionModal').dataset.actionFor;
                !qnsList[Number(qnNo)].optionsList && (qnsList[Number(qnNo)].optionsList = []);
                const optionValue = document.getElementById('addOptionModal').querySelector('input').value;
                qnsList[Number(qnNo)].optionsList.push(optionValue);
                paintEditForm(qnsList, surveyQnHolder);
                cancelOption();
            }

            cancelOption = () => {
                document.getElementById('addOptionModal').querySelector('input').value = '';
                closeModal('addOptionModal');
            }

            deleteOption = (qnId, optionId) => {
                qnsList[Number(qnId)].optionsList.splice(optionId, 1);
                paintEditForm(qnsList, surveyQnHolder);
            }

            changeReqdValidation = (qnNo, e) => {
                qnsList[Number(qnNo) - 1].requireValidation = e.checked;
            }

            addQnToList = () => {
                const newQn = {
                    statement: '',
                    optionsList: [],
                    requireValidation: false,
                    type: 'text'
                }
                qnsList.push(newQn);
                paintEditForm(qnsList, surveyQnHolder);
                document.getElementById('QnNo' + qnsList.length).scrollIntoView();
                document.getElementById('QnNo' + qnsList.length + 'Statement').focus();
            }

            changeOnce = (e) => {
                surveyForm.once = !e.checked;
            }

            changeAddAdditionalComments = (e) => {
                surveyForm.needAdditionalComments = e.checked;
            }

            publishSurvey = () => {
                let url = existingSurvey ? '/survey/' + feedbackForID : '/survey';
                fetch(url, {
                    method: 'post',
                    body: JSON.stringify(surveyForm),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(resp => {
                    resp.json().then(r => {
                        if (r.status == 'SUCCESS') {
                            $Router.hash('#surveys');
                        }
                    })
                });
            }

            saveSurvey = () => {
                surveyForm.qns = qnsList;
                showModal('publishModal');
            }

            if (feedbackForID) {
                existingSurvey = true;
                fetch('/survey/' + feedbackForID).then(checkForErrors).then(res => {
                    return res.json();
                }).then(res => {
                    document.title = res.name + ' | Edit Form from FeeFo';
                    document.getElementById('survey_name').textContent = res.name;
                    document.getElementById('survey_name').title = res.name;
                    document.getElementById('edit_survey_name').textContent = res.name;
                    document.getElementById('survey_name').href = `/?id=${feedbackForID}#edit`;
                    surveyForm = res;
                    qnsList = res.qns;
                    res.replyCount ? document.getElementById('republishSurveyMsg').style.display = 'block' : document.getElementById('republishSurveyMsg').style.display = 'none';
                    document.getElementById('allow-multiple-responses-cb').checked = !res.once;
                    document.getElementById('need-additional-comments-cb').checked = res.needAdditionalComments;
                    paintEditForm(res.qns, surveyQnHolder);
                    windowScrollingFn();
                    hideLoader();
                });
            } else {
                document.getElementById('republishSurveyMsg').style.display = 'none';
                hideLoader();
                qnsList = [];
                document.getElementById('survey_name').textContent = 'Survey Name';
                document.getElementById('edit_survey_name').focus();
            }
        }

        if (ap === 'feedback') {
            const errorMsgHolder = document.getElementById('error-msgs');
            const submitBtn = document.getElementById('submit_button');
            let version, totalQnsLength = 0, mandatoryQns = 0;
            document.querySelectorAll('[ data-not-needed]').forEach(el => {
                el.dataset.notNeeded = true;
            });

            let answers = {
                feedback: [],
                additionalComments: '',
                feedbackFor: ''
            };

            //global error handling
            window.onerror = (e) => {
                const msg = e.replace('Uncaught ', '');
                if (msg !== 'Script error.') {
                    errorMsgHolder.textContent = msg;
                    errorMsgHolder.style.display = 'block';
                    errorMsgHolder.scrollIntoView();
                }
            }

            const generateFeedbackClob = () => {
                answers.feedback = [];
                for (let i = 1; i < totalQnsLength + 1; i++) {
                    document.querySelectorAll('input[name=qn_' + i + ']').forEach(input => {
                        input.checked && answers.feedback.push(input.id);
                        if (input.type === 'text') {
                            input.value && answers.feedback.push('qn_' + i + '_' + input.value);
                        }
                    })
                }
                // adding additional comments to the answers object
                answers.additionalComments = document.querySelector('textarea[name=additional_comments]').value;
            }

            const validateFields = () => {
                errorMsgHolder.style.display = 'none';
                generateFeedbackClob();
                const answeredQns = [];
                answers.feedback.forEach(ans => {
                    if (!answeredQns.includes(ans.split('_')[1])) {
                        answeredQns.push(ans.split('_')[1]);
                    }
                });
                if (answeredQns.length < mandatoryQns) {
                    throw (`Questions marked with * are mandatory`)
                }
            }

            const getIpType = (type) => {
                const op = {};
                switch (type) {
                    case 'many':
                        op.type = 'checkbox';
                        op.reqValue = true;
                        break;
                    case 'text':
                        op.type = 'text';
                        op.reqValue = false;
                        break;
                    case 'one':
                    default:
                        op.type = 'radio';
                        op.reqValue = true;
                        break;
                }
                return op;
            }

            const getQnAndOptionsList = (qnObj, index) => {
                const holderDiv = Templates.createEl('', 'md:mb-4');
                let qn = qnObj.statement;
                qnObj.requireValidation && (qn += ' *');
                let optionsList = qnObj.optionsList;
                // Getting Qns Printed
                const qnDiv = Templates.createEl('div', 'pl-1 pr-4 pt-3 pb-0 md:pb-1 tracking-wider font-medium text-gray-900');
                qnDiv.textContent = qn;
                holderDiv.append(qnDiv);
                // Getting Options Printed
                const optionHolderDiv = Templates.createEl('div', 'pl-1 pr-4 pb-3 pt-0 md:pt-1 tracking-wider text-gray-900');
                const ipType = getIpType(qnObj.type);
                optionsList.forEach((optn, optn_index) => {
                    const optionDiv = Templates.createEl('div', 'block md:inline-block md:mr-5 my-2 md:my-0');
                    const label = Templates.createEl('label');
                    const id = "qn_" + index + "_" + (Number(optn_index) + 1);
                    label.htmlFor = id;
                    const input = Templates.createEl('input', 'mr-1');
                    input.id = id;
                    input.type = ipType.type;
                    ipType.reqValue && (input.value = id);
                    input.name = "qn_" + index;
                    label.append(input);
                    label.append(optn);
                    optionDiv.append(label);
                    optionHolderDiv.append(optionDiv);
                });
                if (ipType.type === 'text') {
                    const optionDiv = Templates.createEl('div', 'block');
                    const id = "qn_" + index + "_1";
                    const input = Templates.createEl('input', 'w-full md:w-1/2 py-2 px-1 border-b-2 boder-gray-400');
                    input.id = id;
                    input.type = ipType.type;
                    input.name = "qn_" + index;
                    input.placeholder = 'Please Enter Value';
                    input.autocomplete = 'off';
                    optionDiv.append(input);
                    optionHolderDiv.append(optionDiv);
                }
                holderDiv.append(optionHolderDiv);
                return holderDiv;
            }

            errorMsgHolder.style.display = 'none';
            submitBtn.addEventListener('click', () => {
                validateFields();
                fetch('/feedback/' + feedbackForID, {
                    method: 'post',
                    body: JSON.stringify(answers),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(resp => {
                    resp.json().then(r => {
                        if (r.status == 'SUCCESS') {
                            localStorage.setItem('feedback_for', r.data.feedbackFor);
                            $Router.hash('#thank-you');
                        }
                    })
                });
            });

            fetch('/feedback/' + feedbackForID).then(checkForErrors).then(res => {
                // fetch('/getsurveyqns/'+feedbackForID).then(checkForErrors).then(res => {
                return res.json();
            }).then(res => {
                let submittedVersion = localStorage.getItem('feedback_for');
                let courseNameHolder = document.getElementById('course_name');
                let courseNameTableHolder = document.getElementById('course_name_table');
                let courseDateHolder = document.getElementById('course_date');
                let courseTrainersHolder = document.getElementById('course_trainers');
                let extraInfoHolder = document.getElementById('extra-info-holder');

                const additional_comments_holder = document.getElementById('additional_comments_holder');

                //new home-view
                const feedbackQnHolder = document.getElementById('feedbackQnHolder');
                version = res._id;
                if (submittedVersion === version && res.once) {
                    $Router.go('#thank-you');
                }
                answers.feedbackFor = res.feedbackFor;
                //set creator id
                answers.creator = res.userid;
                courseNameHolder.textContent = res.name;
                courseNameTableHolder.textContent = res.name;

                courseDateHolder.textContent = res.date;
                courseTrainersHolder.textContent = res.trainers;

                document.title = res.name + ' | Survey from FeeFo';
                // populating Feedback questions
                res.qns && (totalQnsLength = res.qns.length);

                res.qns.forEach(qn => {
                    qn.requireValidation && mandatoryQns++;
                });

                if (res.needAdditionalComments) {
                    additional_comments_holder.style.display = 'block';
                }

                if (res.showExtraInfoTable) {
                    extraInfoHolder.style.display = 'block'
                }

                res.qns.reverse().forEach((qn, index) => {
                    feedbackQnHolder.prepend(getQnAndOptionsList(qn, (res.qns.length - index)));
                });

                hideLoader();
            });
        }

        if (ap === 'dashboard') {
            let feedbackQnsList = [];
            // let optionsList = [];
            let colorList = ['bg-pink-300', 'bg-red-400', 'bg-green-500', 'bg-yellow-400', 'bg-indigo-500', 'bg-orange-400', 'bg-teal-700'];
            let qnsMap = {};
            const cardHolder = document.getElementById('dashboard_card_holder');

            document.getElementById('autoComplete_Search').addEventListener('keyup', (e) => {
                const searchQuery = e.target.value;
                feedbackQnsList.forEach((qn, i) => {
                    if (qn.statement.toLowerCase().indexOf(searchQuery.toLowerCase()) === -1 && searchQuery.length > 2) {
                        document.getElementById(`feedbackcard${i + 1}`).style.display = 'none';
                    } else {
                        document.getElementById(`feedbackcard${i + 1}`).style.display = 'block';
                    }
                    if (searchQuery.length > 2) {
                        qn.optionsList.forEach(optn => {
                            if (optn.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1) {
                                document.getElementById(`feedbackcard${i + 1}`).style.display = 'block';
                            }
                        });
                    }
                });
            });

            fetch('/dashboard/' + feedbackForID).then(checkForErrors).then(res => {
                return res.json();
            }).then(feedbacks => {
                fetch('/survey/' + feedbackForID).then(checkForErrors).then(res => {
                    return res.json();
                }).then(res => {
                    document.title = res.name + ' | Dashboard from FeeFo';
                    document.getElementById('survey_name_dashboard').textContent = res.name;
                    document.getElementById('survey_name_dashboard').title = res.name;
                    document.getElementById('survey_name_dashboard').href = `/?id=${feedbackForID}#edit`;
                    feedbackQnsList = res.qns;
                    optionsList = res.optionsList;
                    let answeredQnsMapForReplyCount = {};
                    feedbacks.forEach((f, feedbackNo) => {
                        f.feedback.forEach(fb => {
                            let tokens = fb.split('_');
                            let votes = qnsMap[tokens[1]];
                            if (!votes) {
                                votes = [];
                            }
                            let answeredQn = answeredQnsMapForReplyCount[tokens[1]];
                            if (!answeredQn) {
                                answeredQn = {
                                    fbNo: [],
                                    count: 0
                                };
                            }
                            if (!answeredQn.fbNo.includes('fb' + (feedbackNo + 1) + tokens[1])) {
                                answeredQn.fbNo.push('fb' + (feedbackNo + 1) + tokens[1]);
                                answeredQn.count++;
                            }
                            votes.push(tokens[2]);
                            qnsMap[tokens[1]] = votes;
                            answeredQnsMapForReplyCount[tokens[1]] = answeredQn;
                        });
                    });
                    Object.keys(qnsMap).forEach(qnNo => {
                        let card = Templates.DASHBOARD_CARD;
                        card.placeholders.qnNo = qnNo;
                        card.placeholders.qn = feedbackQnsList[qnNo - 1].statement;
                        card.placeholders.noOfReplies = answeredQnsMapForReplyCount[qnNo].count;
                        card.placeholders.mainId = `feedbackcard${qnNo}`;
                        card.placeholders.cardId = `feedbackcardHolder${qnNo}`;
                        let compiledCard = Templates.compile(card);
                        let feedbackHolder = compiledCard.querySelector('#' + card.placeholders.cardId);
                        let optionsList = feedbackQnsList[qnNo - 1].optionsList;
                        // pills
                        optionsList.forEach((optn, index) => {
                            let optionNumber = index + 1;
                            let optionCount = 0;
                            qnsMap[qnNo].forEach(vote => {
                                vote == optionNumber ? optionCount++ : true;
                            });
                            let pill = Templates.FEEDBACK_PILL;
                            pill.placeholders.option = optn;
                            pill.placeholders.count = optionCount;
                            pill.placeholders.pillclass = colorList[index];
                            feedbackHolder.append(Templates.compile(pill));
                        });
                        let seperatorDiv = Templates.createEl('div', 'mt-5');

                        // bar-graph
                        optionsList.forEach((optn, index) => {
                            let optionNumber = index + 1;
                            let optionCount = 0;
                            qnsMap[qnNo].forEach(vote => {
                                vote == optionNumber ? optionCount++ : true;
                            });
                            let bar = Templates.BAR_GRAPH;
                            bar.placeholders.color = colorList[index];
                            bar.placeholders.width = optionCount / qnsMap[qnNo].length * 100;
                            seperatorDiv.append(Templates.compile(bar));
                        });
                        feedbackHolder.append(seperatorDiv);
                        cardHolder.append(compiledCard);
                    });
                    paintMosaic();
                    hideLoader();
                });
            });
        }

        if (ap === 'thank-you') {
            document.querySelectorAll('[ data-not-needed]').forEach(el => {
                el.dataset.notNeeded = true;
            });
            hideLoader();
        }
    }
});