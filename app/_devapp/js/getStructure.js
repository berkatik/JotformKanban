function login() {
    return new Promise(resolve => {
        global.JF.init({ accessType: 'full' });
        global.JF.login(
            function success() {
                resolve(global.JF.getAPIKey());
            },
            function error() {
                window.alert("Could not authorize user");
            }
        )
    })
}


function getFromId() {
    return new Promise(resolve => {
        global.JF.FormPicker({
            multiSelect: false,
            infinite_scroll: true,
            search: true,
            onSelect: function (r) {
                resolve(r[0].id);
            }
        })
    })
}

function getQids(formID) {

    return new Promise((resolve, reject) => {
        JF.getFormQuestions(formID, function (response) {
            const questions = []
            
            for (var i in response) {
                let temp = {
                    "qid": response[i].qid,
                    "title": response[i].text
                }

                questions.push(temp);
            } 
            resolve(questions);
        });
    })
}

function getStructure(formId) {
    return new Promise(resolve => {
        global.JF.QuestionPicker(formId, {
            sort: 'order',
            sortType: 'ASC',
            title: 'Question Picker',
            multiSelect: false,
            ignore_types: [],
            loadForm: false,
            onSelect: function (selectedQuestions) {
                let structure = selectedQuestions[0].options.split("|");
                if (selectedQuestions[0].required == "No") {
                    structure = ["Uncategorized", ...structure];
                }
                resolve({ structure, "qid": selectedQuestions[0].qid, "formId": formId })

                // const structure = selectedQuestions[0].options.split("|");
            }
        });
    })
}

export default async function setUp(component) {
    const apiKey = await login();
    const formId = await getFromId();
    const questions = await getQids(formId);
    const structure = await getStructure(formId);    

    structure["apiKey"] = apiKey;
    structure["questions"] = questions;
    const xmlhttp = new XMLHttpRequest();   // new HttpRequest instance 

    // xmlhttp.onreadystatechange = () => {
    //     if (xmlhttp.readyState === 4)  {
    //         const response = xmlhttp.response;
    //         const xhr = new XMLHttpRequest();
    //         xhr.open("POST", "app/_devapp/app.js", true);
    //         xhr.setRequestHeader("Content-Type", "application/json");
    //         xhr.send(response);
    //     }
    // }

    xmlhttp.open("POST", "connect.php", false);
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.send(JSON.stringify(structure));
    const res = xmlhttp.response;
    component.setState(JSON.parse(res));
}

// export {
//     login,
//     getFromId,
//     getStructure
// }

